export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'customer' | 'staff' | 'manager' | 'admin'
  created_at: string
  last_login?: string
}

export interface Category {
  id: string
  name: string
  description: string
  image_url?: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  category?: Category
  spice_level: number
  is_vegetarian: boolean
  is_vegan: boolean
  ingredients: string[]
  image_url?: string
  is_available: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  order_type: 'pickup' | 'delivery'
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  total_amount: number
  delivery_address?: {
    street: string
    city: string
    postal_code: string
    phone: string
  }
  special_notes?: string
  phone: string
  created_at: string
  updated_at: string
  confirmed_at?: string
  user?: User
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  menu_item?: MenuItem
  quantity: number
  special_instructions?: string
}

export interface Review {
  id: string
  user_id: string
  order_id: string
  rating: number
  comment: string
  platform: 'website' | 'google' | 'facebook'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user?: User
}

export interface DashboardStats {
  todayStats: {
    orders: number
    revenue: number
    pendingOrders: number
  }
  totalCustomers: number
  averageRating: number
  ordersByStatus: {
    pending: number
    confirmed: number
    preparing: number
    ready: number
    completed: number
  }
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface PopularItem {
  id: string
  name: string
  price: number
  totalOrdered: number
}