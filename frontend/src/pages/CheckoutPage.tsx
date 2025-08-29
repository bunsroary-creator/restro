import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { orderService } from '../services/orders'
import { toast } from 'react-hot-toast'
import OTPVerificationModal from '../components/checkout/OTPVerificationModal'

interface CheckoutForm {
  order_type: 'pickup' | 'delivery'
  phone: string
  special_notes: string
  delivery_address?: {
    street: string
    city: string
    postal_code: string
    phone: string
  }
}

const CheckoutPage: React.FC = () => {
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutForm>({
    defaultValues: {
      order_type: 'pickup',
      phone: user?.phone || ''
    }
  })

  const orderType = watch('order_type')

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true)
    try {
      const orderItems = items.map(item => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
        special_instructions: item.special_instructions
      }))

      const orderData = {
        items: orderItems,
        order_type: data.order_type,
        phone: data.phone,
        special_notes: data.special_notes,
        ...(data.order_type === 'delivery' && { delivery_address: data.delivery_address })
      }

      const response = await orderService.createOrder(orderData)
      setOrderId(response.data.order_id)
      setShowOTPModal(true)
      toast.success('Order placed! Please verify your phone number.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOTPSuccess = () => {
    clearCart()
    setShowOTPModal(false)
    toast.success('Order confirmed! You will receive updates on your phone.')
    navigate('/orders')
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          className="text-3xl font-bold text-neutral-900 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Order Type */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      {...register('order_type')}
                      type="radio"
                      value="pickup"
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 border-neutral-200 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-primary-600" />
                        <div>
                          <div className="font-medium">Pickup</div>
                          <div className="text-sm text-neutral-600">Ready in 25 min</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      {...register('order_type')}
                      type="radio"
                      value="delivery"
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 border-neutral-200 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        <div>
                          <div className="font-medium">Delivery</div>
                          <div className="text-sm text-neutral-600">45-60 min</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9+\-\s()]+$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      type="tel"
                      className={`input-field pl-10 ${errors.phone ? 'border-error-500' : ''}`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <motion.div
                  className="card p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Street Address
                      </label>
                      <input
                        {...register('delivery_address.street', {
                          required: orderType === 'delivery' ? 'Street address is required' : false
                        })}
                        type="text"
                        className="input-field"
                        placeholder="Enter your street address"
                      />
                      {errors.delivery_address?.street && (
                        <p className="mt-1 text-sm text-error-600">{errors.delivery_address.street.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        City
                      </label>
                      <input
                        {...register('delivery_address.city', {
                          required: orderType === 'delivery' ? 'City is required' : false
                        })}
                        type="text"
                        className="input-field"
                        placeholder="Munich"
                      />
                      {errors.delivery_address?.city && (
                        <p className="mt-1 text-sm text-error-600">{errors.delivery_address.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        {...register('delivery_address.postal_code', {
                          required: orderType === 'delivery' ? 'Postal code is required' : false
                        })}
                        type="text"
                        className="input-field"
                        placeholder="80539"
                      />
                      {errors.delivery_address?.postal_code && (
                        <p className="mt-1 text-sm text-error-600">{errors.delivery_address.postal_code.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Special Notes */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Special Notes</h2>
                <textarea
                  {...register('special_notes')}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Any special requests or dietary requirements..."
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              className="card p-6 sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.menu_item.id} className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      {item.quantity}x {item.menu_item.name}
                    </span>
                    <span className="font-medium">
                      €{(item.menu_item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-neutral-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Subtotal</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Tax (19%)</span>
                    <span>€{(total * 0.19).toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-sm text-neutral-600">
                      <span>Delivery Fee</span>
                      <span>€2.50</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total</span>
                    <span>
                      €{orderType === 'delivery' 
                        ? (total * 1.19 + 2.5).toFixed(2) 
                        : (total * 1.19).toFixed(2)
                      }
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && orderId && (
        <OTPVerificationModal
          orderId={orderId}
          onSuccess={handleOTPSuccess}
          onClose={() => setShowOTPModal(false)}
        />
      )}
    </div>
  )
}

export default CheckoutPage