import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { MenuItem, Category } from '../types'
import { menuService } from '../services/menu'
import { toast } from 'react-hot-toast'
import MenuItemModal from '../components/menu/MenuItemModal'

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      const [menuResponse, categoriesResponse] = await Promise.all([
        menuService.getMenuItems({
          category: selectedCategory || undefined,
          limit: 100
        }),
        menuService.getCategories()
      ])
      
      setMenuItems(menuResponse.data)
      setCategories(categoriesResponse)
    } catch (error) {
      toast.error('Failed to load menu data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    try {
      await menuService.deleteMenuItem(id)
      toast.success('Menu item deleted')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete menu item')
    }
  }

  const handleModalSuccess = () => {
    setShowModal(false)
    setEditingItem(null)
    fetchData()
  }

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Menu Management</h1>
          <p className="text-neutral-600">Manage your restaurant's menu items and categories</p>
        </div>
        <button
          onClick={handleCreateItem}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </motion.div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="card">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-neutral-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-neutral-900">Item</th>
                  <th className="text-left py-3 px-6 font-medium text-neutral-900">Category</th>
                  <th className="text-left py-3 px-6 font-medium text-neutral-900">Price</th>
                  <th className="text-left py-3 px-6 font-medium text-neutral-900">Spice Level</th>
                  <th className="text-left py-3 px-6 font-medium text-neutral-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    className="border-b border-neutral-200 hover:bg-neutral-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-neutral-900">{item.name}</div>
                          <div className="text-sm text-neutral-600 max-w-xs truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-neutral-700">
                        {item.category?.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-neutral-900">
                        €{item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full ${
                              dot <= item.spice_level ? 'bg-primary-500' : 'bg-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.is_available 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-neutral-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      {showModal && (
        <MenuItemModal
          item={editingItem}
          categories={categories}
          onSuccess={handleModalSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default MenuPage