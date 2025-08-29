import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const CartPage: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingCart className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Your Cart is Empty</h1>
            <p className="text-neutral-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/menu" className="btn-primary">
              Browse Menu
            </Link>
          </motion.div>
        </div>
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Cart</h1>
          <p className="text-neutral-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">Items</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-error-600 hover:text-error-700 transition-colors duration-200"
                >
                  Clear Cart
                </button>
              </div>

              <AnimatePresence>
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.menu_item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg"
                    >
                      <img
                        src={item.menu_item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                        alt={item.menu_item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{item.menu_item.name}</h3>
                        <p className="text-sm text-neutral-600 mb-2">€{item.menu_item.price.toFixed(2)} each</p>
                        {item.special_instructions && (
                          <p className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                            Note: {item.special_instructions}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 border border-neutral-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
                            className="p-2 hover:bg-neutral-100 transition-colors duration-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
                            className="p-2 hover:bg-neutral-100 transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.menu_item.id)}
                          className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="card p-6 sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (19%)</span>
                  <span>€{(total * 0.19).toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-neutral-900">
                    <span>Total</span>
                    <span>€{(total * 1.19).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/menu"
                className="w-full btn-outline mt-3 text-center block"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage