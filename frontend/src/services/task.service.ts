import api from './api'

export const getTasksApi = async (filters?: {
  projectId?: string
  status?: string
  priority?: string
}) => {
  const params = new URLSearchParams()
  if (filters?.projectId) params.append('projectId', filters.projectId)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)
  const response = await api.get(`/tasks?${params.toString()}`)
  return response.data
}

export const createTaskApi = async (data: {
  title: string
  description: string
  priority: string
  dueDate: string
  assigneeId: string
  projectId: string
}) => {
  const response = await api.post('/tasks', data)
  return response.data
}

export const updateTaskStatusApi = async (id: string, status: string) => {
  const response = await api.patch(`/tasks/${id}/status`, { status })
  return response.data
}

export const deleteTaskApi = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}