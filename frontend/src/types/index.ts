export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  createdAt?: string
}

export interface Project {
  id: string
  name: string
  description: string
  startDate: string
  dueDate: string
  createdBy: string
  createdAt: string
  members: ProjectMember[]
  tasks?: Task[]
  stats?: ProjectStats
}

export interface ProjectMember {
  id: string
  userId: string
  projectId: string
  role: string
  user: User
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  dueDate: string
  assigneeId: string
  projectId: string
  assignee: User
  project?: { id: string; name: string }
  createdAt: string
  isOverdue?: boolean
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface ProjectStats {
  total: number
  completed: number
  inProgress: number
  todo: number
  review: number
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  reviewTasks: number
  overdueTasks: number
  completionRate: number
}

export interface Analytics {
  tasksByStatus: ChartData[]
  tasksByPriority: ChartData[]
  tasksByMember: MemberData[]
  weeklyData: WeeklyData[]
  projectProgress: ProjectProgress[]
}

export interface ChartData {
  name: string
  value: number
}

export interface MemberData {
  name: string
  total: number
  completed: number
}

export interface WeeklyData {
  day: string
  completed: number
}

export interface ProjectProgress {
  name: string
  total: number
  completed: number
  progress: number
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}