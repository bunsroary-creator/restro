import api from './api'
import { DashboardStats, SalesData, PopularItem } from '../types'

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/analytics/dashboard')
    return response.data.data
  },

  getSalesTrends: async (period: '7d' | '30d' | '90d' = '7d'): Promise<SalesData[]> => {
    const response = await api.get('/analytics/sales-trends', {
      params: { period }
    })
    return response.data.data
  },

  getPopularItems: async (): Promise<PopularItem[]> => {
    const response = await api.get('/analytics/popular-items')
    return response.data.data
  }
}