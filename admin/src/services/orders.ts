import api from './api'
import { Order } from '../types'

export const orderService = {
  getOrders: async (params?: {
    status?: string
    order_type?: string
    page?: number
    limit?: number
  }): Promise<{ data: Order[] }> => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status })
    return response.data
  }
}