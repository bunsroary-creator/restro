import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, Flame, Leaf, Heart } from 'lucide-react'
import { MenuItem, Category } from '../types'
import { menuService } from '../services/menu'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-hot-toast'
import MenuItemCard from '../components/menu/MenuItemCard'
import MenuFilters from '../components/menu/MenuFilters'

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<number | null>(null)
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { addItem } = useCart()

  useEffect(() => {
    fetchData()
  }, [selectedCategory, selectedSpiceLevel, isVegetarian, isVegan, searchTerm])

  const fetchData = async () => {
    try {
      const [menuResponse, categoriesResponse] = await Promise.all([
        menuService.getMenuItems({
          category: selectedCategory || undefined,
          spice_level: selectedSpiceLevel || undefined,
          is_vegetarian: isVegetarian || undefined,
          is_vegan: isVegan || undefined,
          search: searchTerm || undefined,
        }),
        menuService.getCategories()
      ])
      
      setMenuItems(menuResponse.data)
      setCategories(categoriesResponse)
    } catch (error) {
      toast.error('Failed to load menu items')
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (menuItem: MenuItem, quantity: number, specialInstructions?: string) => {
    addItem(menuItem, quantity, specialInstructions)
    toast.success(`${menuItem.name} added to cart!`)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSpiceLevel(null)
    setIsVegetarian(false)
    setIsVegan(false)
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Our Menu
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover authentic Nepalese flavors crafted with traditional recipes and fresh ingredients
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:w-80"
              >
                <MenuFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedSpiceLevel={selectedSpiceLevel}
                  setSelectedSpiceLevel={setSelectedSpiceLevel}
                  isVegetarian={isVegetarian}
                  setIsVegetarian={setIsVegetarian}
                  isVegan={isVegan}
                  setIsVegan={setIsVegan}
                  onClearFilters={clearFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menu Items */}
          <div className="flex-1">
            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-600 mb-4">No dishes found</p>
                <button 
                  onClick={clearFilters}
                  className="btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="initial"
                animate="animate"
              >
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuPage