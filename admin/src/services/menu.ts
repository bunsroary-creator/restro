import api from './api'
import { MenuItem, Category } from '../types'

export const menuService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/menu/categories')
    return response.data.data
  },

  getMenuItems: async (params?: {
    category?: string
    page?: number
    limit?: number
  }): Promise<{ data: MenuItem[] }> => {
    const response = await api.get('/menu/items', { params })
    return response.data
  },

  createMenuItem: async (data: Partial<MenuItem>) => {
    const response = await api.post('/menu/items', data)
    return response.data
  },

  updateMenuItem: async (id: string, data: Partial<MenuItem>) => {
    const response = await api.put(`/menu/items/${id}`, data)
    return response.data
  },

  deleteMenuItem: async (id: string) => {
    const response = await api.delete(`/menu/items/${id}`)
    return response.data
  }
}