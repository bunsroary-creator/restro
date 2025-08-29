import api from './api'
import { MenuItem, Category } from '../types'

export const menuService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/menu/categories')
    return response.data.data
  },

  getMenuItems: async (params?: {
    category?: string
    spice_level?: number
    is_vegetarian?: boolean
    is_vegan?: boolean
    search?: string
    page?: number
    limit?: number
  }): Promise<{ data: MenuItem[]; pagination: any }> => {
    const response = await api.get('/menu/items', { params })
    return response.data
  }
}