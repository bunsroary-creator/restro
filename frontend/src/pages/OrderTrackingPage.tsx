import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, Package, Truck, MapPin } from 'lucide-react'
import { Order } from '../types'
import { orderService } from '../services/orders'
import { toast } from 'react-hot-toast'

const OrderTrackingPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders()
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-warning-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-primary-500" />
      case 'preparing':
        return <Package className="w-5 h-5 text-secondary-500" />
      case 'ready':
        return <Truck className="w-5 h-5 text-accent-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      default:
        return <Clock className="w-5 h-5 text-neutral-500" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Orders</h1>
          <p className="text-neutral-600">Track your current and past orders</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No Orders Yet</h2>
            <p className="text-neutral-600 mb-6">You haven't placed any orders yet.</p>
            <Link to="/menu" className="btn-primary">
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      Order #{order.id.slice(-6)}
                    </h3>
                    <p className="text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString()} at {' '}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <div className="text-lg font-semibold text-neutral-900">
                      €{order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Type:</span>
                        <span className="capitalize">{order.order_type}</span>
                      </div>
                      {order.order_type === 'delivery' && order.delivery_address && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                          <div>
                            <div>{order.delivery_address.street}</div>
                            <div>{order.delivery_address.city} {order.delivery_address.postal_code}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-900 mb-3">Items</h4>
                    <div className="space-y-1 text-sm">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-neutral-600">
                            {item.quantity}x {item.menu_item?.name}
                          </span>
                          <span>€{((item.menu_item?.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {order.special_notes && (
                  <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      <strong>Special Notes:</strong> {order.special_notes}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTrackingPage