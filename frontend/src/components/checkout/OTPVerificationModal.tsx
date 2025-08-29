import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Smartphone } from 'lucide-react'
import { orderService } from '../../services/orders'
import { toast } from 'react-hot-toast'

interface OTPVerificationModalProps {
  orderId: string
  onSuccess: () => void
  onClose: () => void
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  orderId,
  onSuccess,
  onClose
}) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast.error('OTP has expired. Please place a new order.')
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onClose])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      await orderService.verifyOTP(orderId, otp)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Verify Your Phone</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-600">
            We've sent a 6-digit verification code to your phone number. Please enter it below to confirm your order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              className="input-field text-center text-lg font-mono tracking-wider"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          <div className="text-center text-sm text-neutral-500">
            Code expires in: <span className="font-medium text-primary-600">{formatTime(timeLeft)}</span>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Confirm Order'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default OTPVerificationModal