import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { MenuItem, Category } from '../../types'
import { menuService } from '../../services/menu'
import { toast } from 'react-hot-toast'

interface MenuItemModalProps {
  item?: MenuItem | null
  categories: Category[]
  onSuccess: () => void
  onClose: () => void
}

interface MenuItemForm {
  name: string
  description: string
  price: number
  category_id: string
  spice_level: number
  is_vegetarian: boolean
  is_vegan: boolean
  ingredients: string
  image_url: string
  is_available: boolean
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  categories,
  onSuccess,
  onClose
}) => {
  const [loading, setLoading] = useState(false)
  const isEditing = !!item

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MenuItemForm>({
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      category_id: item?.category_id || '',
      spice_level: item?.spice_level || 0,
      is_vegetarian: item?.is_vegetarian || false,
      is_vegan: item?.is_vegan || false,
      ingredients: item?.ingredients?.join(', ') || '',
      image_url: item?.image_url || '',
      is_available: item?.is_available ?? true
    }
  })

  const onSubmit = async (data: MenuItemForm) => {
    setLoading(true)
    try {
      const formattedData = {
        ...data,
        ingredients: data.ingredients.split(',').map(i => i.trim()).filter(Boolean)
      }

      if (isEditing) {
        await menuService.updateMenuItem(item.id, formattedData)
        toast.success('Menu item updated successfully')
      } else {
        await menuService.createMenuItem(formattedData)
        toast.success('Menu item created successfully')
      }
      
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save menu item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="input-field"
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category *
              </label>
              <select
                {...register('category_id', { required: 'Category is required' })}
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-error-600">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="input-field resize-none"
              placeholder="Enter item description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price (€) *
              </label>
              <input
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0.01, message: 'Price must be greater than 0' }
                })}
                type="number"
                step="0.01"
                className="input-field"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-error-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Spice Level (0-5)
              </label>
              <select
                {...register('spice_level')}
                className="input-field"
              >
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    {level === 0 ? 'No Spice' : `Level ${level}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ingredients (comma-separated)
            </label>
            <input
              {...register('ingredients')}
              type="text"
              className="input-field"
              placeholder="tomato, onion, garlic, spices"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Image URL
            </label>
            <input
              {...register('image_url')}
              type="url"
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                {...register('is_vegetarian')}
                type="checkbox"
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Vegetarian</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                {...register('is_vegan')}
                type="checkbox"
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Vegan</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                {...register('is_available')}
                type="checkbox"
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Available</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default MenuItemModal