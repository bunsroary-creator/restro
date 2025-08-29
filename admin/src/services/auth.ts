import api from './api'
import { User } from '../types'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  logout: () => {
    localStorage.removeItem('admin_token')
  }
}