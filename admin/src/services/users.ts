import api from './api'
import { User } from '../types'

export const userService = {
  getUsers: async (params?: {
    role?: string
    page?: number
    limit?: number
  }): Promise<{ data: User[] }> => {
    const response = await api.get('/users', { params })
    return response.data
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/users/${userId}/role`, { role })
    return response.data
  }
}