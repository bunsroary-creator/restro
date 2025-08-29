import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Check, X, Search } from 'lucide-react'
import { Review } from '../types'
import { reviewService } from '../services/reviews'
import { toast } from 'react-hot-toast'

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    fetchReviews()
  }, [statusFilter])

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getReviews({
        status: statusFilter || undefined,
        limit: 100
      })
      setReviews(response.data)
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const moderateReview = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await reviewService.moderateReview(reviewId, status)
      toast.success(`Review ${status}`)
      fetchReviews()
    } catch (error) {
      toast.error('Failed to moderate review')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-warning-500 fill-current' : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800'
      case 'rejected':
        return 'bg-error-100 text-error-800'
      case 'pending':
        return 'bg-warning-100 text-warning-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const filteredReviews = reviews.filter(review =>
    review.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Review Management</h1>
        <p className="text-neutral-600">Moderate customer reviews and feedback</p>
      </motion.div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('')
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-20 bg-neutral-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {review.user?.full_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">
                          {review.user?.full_name}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-neutral-600">
                        ({review.rating}/5)
                      </span>
                    </div>

                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <p className="text-neutral-700 leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  <div className="text-sm text-neutral-500">
                    Platform: <span className="capitalize">{review.platform}</span>
                  </div>
                </div>

                {review.status === 'pending' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => moderateReview(review.id, 'approved')}
                      className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors duration-200"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moderateReview(review.id, 'rejected')}
                      className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewsPage