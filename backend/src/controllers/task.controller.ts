import { Response } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../config/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

// 🔥 Helper to safely extract id
const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id

// Create task
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { title, description, priority, dueDate, assigneeId, projectId } = req.body
    const userId = req.user!.id

    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId }
    })

    if (!membership) {
      res.status(403).json({ message: 'You are not a member of this project' })
      return
    }

    const assigneeMembership = await prisma.projectMember.findFirst({
      where: { projectId, userId: assigneeId }
    })

    if (!assigneeMembership) {
      res.status(400).json({ message: 'Assignee is not a member of this project' })
      return
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: new Date(dueDate),
        assigneeId,
        projectId,
        status: 'TODO'
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    })

    res.status(201).json({
      message: 'Task created successfully',
      task
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while creating task' })
  }
}

// Get all tasks
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { projectId, status, priority, assigneeId } = req.query

    const tasks = await prisma.task.findMany({
    where: {
  project: {
    members: {
      some: { userId }
    }
  },
  ...(projectId && { projectId: String(projectId) }),
  ...(status && { status: status as any }),
  ...(priority && { priority: priority as any }),
  ...(assigneeId && { assigneeId: String(assigneeId) })
},
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const now = new Date()

    const tasksWithOverdue = tasks.map(task => ({
      ...task,
      isOverdue: task.dueDate < now && task.status !== 'COMPLETED'
    }))

    res.status(200).json({ tasks: tasksWithOverdue })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while fetching tasks' })
  }
}

// Get single task
export const getTaskById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getParamId(req.params.id)
    const userId = req.user!.id

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          members: {
            some: { userId }
          }
        }
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    })

    if (!task) {
      res.status(404).json({ message: 'Task not found or access denied' })
      return
    }

    res.status(200).json({ task })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while fetching task' })
  }
}

// Update task
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const id = getParamId(req.params.id)
    const userId = req.user!.id
    const { title, description, priority, dueDate, assigneeId } = req.body

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          members: {
            some: { userId }
          }
        }
      }
    })

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found or access denied' })
      return
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(assigneeId && { assigneeId })
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    res.status(200).json({
      message: 'Task updated successfully',
      task
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while updating task' })
  }
}

// Update status only
export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const id = getParamId(req.params.id)
    const userId = req.user!.id
    const { status } = req.body

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          members: {
            some: { userId }
          }
        }
      }
    })

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found or access denied' })
      return
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status }
    })

    res.status(200).json({
      message: 'Task status updated successfully',
      task
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while updating status' })
  }
}

// Delete task
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getParamId(req.params.id)
    const userId = req.user!.id

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          members: {
            some: { userId }
          }
        }
      }
    })

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found or access denied' })
      return
    }

    await prisma.task.delete({ where: { id } })

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while deleting task' })
  }
}