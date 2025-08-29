import api from './api'
import { Order, CartItem } from '../types'

export const orderService = {
  createOrder: async (orderData: {
    items: Array<{
      menu_item_id: string
      quantity: number
      special_instructions?: string
    }>
    order_type: 'pickup' | 'delivery'
    delivery_address?: {
      street: string
      city: string
      postal_code: string
      phone: string
    }
    special_notes?: string
    phone: string
  }) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  verifyOTP: async (orderId: string, otp: string) => {
    const response = await api.post(`/orders/${orderId}/verify-otp`, { otp })
    return response.data
  },

  getUserOrders: async (page = 1, limit = 10): Promise<{ data: Order[] }> => {
    const response = await api.get('/orders/my-orders', {
      params: { page, limit }
    })
    return response.data
  }
}