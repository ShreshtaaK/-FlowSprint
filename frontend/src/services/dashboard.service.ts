import api from './api'

export const getDashboardStatsApi = async () => {
  const response = await api.get('/dashboard/stats')
  return response.data
}

export const getAnalyticsApi = async () => {
  const response = await api.get('/dashboard/analytics')
  return response.data
}