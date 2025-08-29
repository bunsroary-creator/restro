import api from './api'
import { Review } from '../types'

export const reviewService = {
  getReviews: async (params?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<{ data: Review[] }> => {
    const response = await api.get('/reviews', { params })
    return response.data
  },

  moderateReview: async (reviewId: string, status: 'approved' | 'rejected') => {
    const response = await api.put(`/reviews/${reviewId}/moderate`, { status })
    return response.data
  }
}