import api from './api'
import type { AuthResponse } from '../types'

export const loginApi = async (data: {
  email: string
  password: string
}): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerApi = async (data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const getMeApi = async () => {
  const response = await api.get('/auth/me')
  return response.data
}