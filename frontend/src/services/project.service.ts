import api from './api'

export const getProjectsApi = async () => {
  const response = await api.get('/projects')
  return response.data
}

export const getProjectByIdApi = async (id: string) => {
  const response = await api.get(`/projects/${id}`)
  return response.data
}

export const createProjectApi = async (data: {
  name: string
  description: string
  startDate: string
  dueDate: string
}) => {
  const response = await api.post('/projects', data)
  return response.data
}

export const updateProjectApi = async (
  id: string,
  data: { name?: string; description?: string; dueDate?: string }
) => {
  const response = await api.put(`/projects/${id}`, data)
  return response.data
}

export const deleteProjectApi = async (id: string) => {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}