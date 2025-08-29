import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, Package, Truck } from 'lucide-react'
import { Order } from '../../types'
import { orderService } from '../../services/orders'

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentOrders()
  }, [])

  const fetchRecentOrders = async () => {
    try {
      const response = await orderService.getOrders({ limit: 5 })
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch recent orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-500" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-primary-500" />
      case 'preparing':
        return <Package className="w-4 h-4 text-secondary-500" />
      case 'ready':
        return <Truck className="w-4 h-4 text-accent-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning-600 bg-warning-100'
      case 'confirmed':
        return 'text-primary-600 bg-primary-100'
      case 'preparing':
        return 'text-secondary-600 bg-secondary-100'
      case 'ready':
        return 'text-accent-600 bg-accent-100'
      case 'completed':
        return 'text-success-600 bg-success-100'
      case 'cancelled':
        return 'text-error-600 bg-error-100'
      default:
        return 'text-neutral-600 bg-neutral-100'
    }
  }

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Recent Orders</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-neutral-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    #{order.id.slice(-6)}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {order.user?.full_name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-neutral-900">
                  €{order.total_amount.toFixed(2)}
                </div>
                <div className="text-sm text-neutral-600 capitalize">
                  {order.order_type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default RecentOrders