import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Flame, Leaf, Heart } from 'lucide-react'
import { MenuItem } from '../../types'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(item, quantity, specialInstructions || undefined)
    setQuantity(1)
    setSpecialInstructions('')
  }

  const SpiceIndicator = ({ level }: { level: number }) => (
    <div className="spice-indicator">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`spice-dot ${dot <= level ? 'active' : 'inactive'}`}
        />
      ))}
    </div>
  )

  return (
    <motion.div
      className="card overflow-hidden group"
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex space-x-1">
          {item.is_vegan && (
            <div className="bg-accent-500 text-white p-1.5 rounded-full">
              <Heart className="w-3 h-3" />
            </div>
          )}
          {item.is_vegetarian && !item.is_vegan && (
            <div className="bg-secondary-500 text-white p-1.5 rounded-full">
              <Leaf className="w-3 h-3" />
            </div>
          )}
          {item.spice_level > 0 && (
            <div className="bg-primary-500 text-white p-1.5 rounded-full">
              <Flame className="w-3 h-3" />
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-white text-primary-600 px-2 py-1 rounded-full text-sm font-semibold">
            €{item.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">{item.name}</h3>
          {item.category && (
            <span className="text-sm text-neutral-500">{item.category.name}</span>
          )}
        </div>

        <p className="text-neutral-600 text-sm mb-3 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <SpiceIndicator level={item.spice_level} />
          <div className="flex items-center space-x-2">
            {item.is_vegetarian && (
              <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded">
                Vegetarian
              </span>
            )}
            {item.is_vegan && (
              <span className="text-xs bg-accent-100 text-accent-800 px-2 py-1 rounded">
                Vegan
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors duration-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Special instructions (optional)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!item.is_available}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {item.is_available ? 'Add to Cart' : 'Not Available'}
        </button>
      </div>
    </motion.div>
  )
}

export default MenuItemCard