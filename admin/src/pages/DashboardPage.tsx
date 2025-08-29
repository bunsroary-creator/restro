import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Star, 
  Clock,
  ShoppingBag,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { DashboardStats } from '../types'
import { analyticsService } from '../services/analytics'
import { toast } from 'react-hot-toast'
import StatsCard from '../components/dashboard/StatsCard'
import RecentOrders from '../components/dashboard/RecentOrders'
import SalesChart from '../components/dashboard/SalesChart'

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const data = await analyticsService.getDashboardStats()
      setStats(data)
    } catch (error) {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Overview of your restaurant's performance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Orders"
          value={stats?.todayStats.orders || 0}
          icon={ShoppingBag}
          color="primary"
          trend="+12%"
        />
        <StatsCard
          title="Today's Revenue"
          value={`€${stats?.todayStats.revenue.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="secondary"
          trend="+8%"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="accent"
          trend="+5%"
        />
        <StatsCard
          title="Average Rating"
          value={stats?.averageRating || 0}
          icon={Star}
          color="warning"
          suffix="/5"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders />
      </div>

      {/* Order Status Overview */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'pending', count: stats?.ordersByStatus.pending || 0, color: 'warning', icon: Clock },
            { status: 'confirmed', count: stats?.ordersByStatus.confirmed || 0, color: 'primary', icon: ShoppingBag },
            { status: 'preparing', count: stats?.ordersByStatus.preparing || 0, color: 'secondary', icon: Clock },
            { status: 'ready', count: stats?.ordersByStatus.ready || 0, color: 'accent', icon: AlertCircle },
            { status: 'completed', count: stats?.ordersByStatus.completed || 0, color: 'success', icon: ShoppingBag },
          ].map((item) => (
            <div key={item.status} className="text-center p-4 bg-neutral-50 rounded-lg">
              <item.icon className={`w-6 h-6 mx-auto mb-2 text-${item.color}-600`} />
              <div className="text-2xl font-bold text-neutral-900">{item.count}</div>
              <div className="text-sm text-neutral-600 capitalize">{item.status}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage