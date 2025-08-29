import React from 'react'
import { motion } from 'framer-motion'
import { X, Flame, Leaf, Heart } from 'lucide-react'
import { Category } from '../../types'

interface MenuFiltersProps {
  categories: Category[]
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedSpiceLevel: number | null
  setSelectedSpiceLevel: (level: number | null) => void
  isVegetarian: boolean
  setIsVegetarian: (value: boolean) => void
  isVegan: boolean
  setIsVegan: (value: boolean) => void
  onClearFilters: () => void
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSpiceLevel,
  setSelectedSpiceLevel,
  isVegetarian,
  setIsVegetarian,
  isVegan,
  setIsVegan,
  onClearFilters
}) => {
  const hasActiveFilters = selectedCategory || selectedSpiceLevel !== null || isVegetarian || isVegan

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-neutral-700 mb-3">Categories</h4>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
              !selectedCategory
                ? 'bg-primary-100 text-primary-800'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Spice Level */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center">
          <Flame className="w-4 h-4 mr-2" />
          Spice Level
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedSpiceLevel(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
              selectedSpiceLevel === null
                ? 'bg-primary-100 text-primary-800'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All Levels
          </button>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedSpiceLevel(level)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
                selectedSpiceLevel === level
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <span>Level {level}</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot <= level ? 'bg-primary-500' : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-700 mb-3">Dietary Preferences</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-secondary-600" />
              <span className="text-sm text-neutral-700">Vegetarian</span>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isVegan}
              onChange={(e) => setIsVegan(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-accent-600" />
              <span className="text-sm text-neutral-700">Vegan</span>
            </div>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

export default MenuFilters