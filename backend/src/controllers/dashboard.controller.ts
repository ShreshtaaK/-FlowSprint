import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

// Get dashboard stats
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const now = new Date()

    // Get all projects user is member of
    const userProjects = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    })

    const projectIds = userProjects.map(p => p.projectId)

    // Get all tasks in those projects
    const allTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Calculate stats
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length
    const pendingTasks = allTasks.filter(t => t.status === 'TODO').length
    const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS').length
    const reviewTasks = allTasks.filter(t => t.status === 'REVIEW').length
    const overdueTasks = allTasks.filter(
      t => t.dueDate < now && t.status !== 'COMPLETED'
    ).length

    // Recent tasks (last 5)
    const recentTasks = allTasks
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)

    // Upcoming deadlines (next 7 days, not completed)
    const next7Days = new Date()
    next7Days.setDate(next7Days.getDate() + 7)

    const upcomingDeadlines = allTasks
      .filter(
        t =>
          t.dueDate >= now &&
          t.dueDate <= next7Days &&
          t.status !== 'COMPLETED'
      )
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5)

    // Project count
    const totalProjects = projectIds.length

    res.status(200).json({
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        reviewTasks,
        overdueTasks,
        completionRate:
          totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0
      },
      recentTasks,
      upcomingDeadlines
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching dashboard stats' })
  }
}

// Get analytics data for charts
export const getAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const now = new Date()

    // Get all projects user is member of
    const userProjects = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    })

    const projectIds = userProjects.map(p => p.projectId)

    // Get all tasks
    const allTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Task distribution by status (for pie chart)
    const tasksByStatus = [
      {
        name: 'Todo',
        value: allTasks.filter(t => t.status === 'TODO').length
      },
      {
        name: 'In Progress',
        value: allTasks.filter(t => t.status === 'IN_PROGRESS').length
      },
      {
        name: 'Review',
        value: allTasks.filter(t => t.status === 'REVIEW').length
      },
      {
        name: 'Completed',
        value: allTasks.filter(t => t.status === 'COMPLETED').length
      }
    ]

    // Task distribution by priority (for bar chart)
    const tasksByPriority = [
      {
        name: 'Low',
        value: allTasks.filter(t => t.priority === 'LOW').length
      },
      {
        name: 'Medium',
        value: allTasks.filter(t => t.priority === 'MEDIUM').length
      },
      {
        name: 'High',
        value: allTasks.filter(t => t.priority === 'HIGH').length
      },
      {
        name: 'Critical',
        value: allTasks.filter(t => t.priority === 'CRITICAL').length
      }
    ]

    // Tasks per member (for bar chart)
    const memberTaskMap: Record<string, {
      name: string
      total: number
      completed: number
    }> = {}

    allTasks.forEach(task => {
      const memberId = task.assignee.id
      const memberName = task.assignee.name

      if (!memberTaskMap[memberId]) {
        memberTaskMap[memberId] = {
          name: memberName,
          total: 0,
          completed: 0
        }
      }

      memberTaskMap[memberId].total += 1

      if (task.status === 'COMPLETED') {
        memberTaskMap[memberId].completed += 1
      }
    })

    const tasksByMember = Object.values(memberTaskMap)

    // Weekly productivity (last 7 days completed tasks)
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' })

      const completedOnDay = allTasks.filter(
        t =>
          t.status === 'COMPLETED' &&
          t.createdAt >= date &&
          t.createdAt < nextDate
      ).length

      weeklyData.push({
        day: dayLabel,
        completed: completedOnDay
      })
    }

    // Project progress (for each project)
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      include: {
        tasks: {
          select: { status: true }
        }
      }
    })

    const projectProgress = projects.map(project => {
      const total = project.tasks.length
      const completed = project.tasks.filter(
        t => t.status === 'COMPLETED'
      ).length

      return {
        name: project.name,
        total,
        completed,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    })

    res.status(200).json({
      tasksByStatus,
      tasksByPriority,
      tasksByMember,
      weeklyData,
      projectProgress
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching analytics' })
  }
}