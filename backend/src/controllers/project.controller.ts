import { Response } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../config/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

// Create project
export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { name, description, startDate, dueDate, memberIds } = req.body
    const userId = req.user!.id

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        createdBy: userId,
        members: {
          create: [
            { userId, role: 'ADMIN' },
            ...(memberIds || []).map((id: string) => ({
              userId: id,
              role: 'MEMBER'
            }))
          ]
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    })

    res.status(201).json({
      message: 'Project created successfully',
      project
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while creating project' })
  }
}

// Get all projects for logged in user
export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const projectsWithStats = projects.map(project => ({
      ...project,
      stats: {
        total: project.tasks.length,
        completed: project.tasks.filter(t => t.status === 'COMPLETED').length,
        inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
        todo: project.tasks.filter(t => t.status === 'TODO').length,
        review: project.tasks.filter(t => t.status === 'REVIEW').length
      }
    }))

    res.status(200).json({ projects: projectsWithStats })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while fetching projects' })
  }
}

// Get single project by ID
export const getProjectById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
   const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
    const userId = req.user!.id

    const project = await prisma.project.findFirst({
      where: {
        id,
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      res.status(404).json({ message: 'Project not found or access denied' })
      return
    }

    res.status(200).json({ project })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while fetching project' })
  }
}

// Update project
export const updateProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

   const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
    const userId = req.user!.id
    const { name, description, dueDate } = req.body

    const membership = await prisma.projectMember.findFirst({
      where: { projectId: id, userId, role: 'ADMIN' }
    })

    if (!membership) {
      res.status(403).json({ message: 'Only project admins can update the project' })
      return
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) })
      }
    })

    res.status(200).json({
      message: 'Project updated successfully',
      project
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while updating project' })
  }
}

// Delete project
export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
    const userId = req.user!.id

    const membership = await prisma.projectMember.findFirst({
      where: { projectId: id, userId, role: 'ADMIN' }
    })

    if (!membership) {
      res.status(403).json({ message: 'Only project admins can delete the project' })
      return
    }

    await prisma.task.deleteMany({ where: { projectId: id } })
    await prisma.projectMember.deleteMany({ where: { projectId: id } })
    await prisma.project.delete({ where: { id } })

    res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while deleting project' })
  }
}