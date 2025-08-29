import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Shield, Database, Globe } from 'lucide-react'

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-600">Configure your restaurant's system settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            General Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                defaultValue="Himalayan Kitchen"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                defaultValue="+49 89 1234 5678"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address
              </label>
              <textarea
                rows={3}
                defaultValue="Maximilianstraße 35, 80539 Munich, Germany"
                className="input-field resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">New Order Alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">Review Notifications</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">Daily Reports</span>
              <input
                type="checkbox"
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </h3>
          
          <div className="space-y-4">
            <button className="w-full btn-outline text-left">
              Change Password
            </button>
            <button className="w-full btn-outline text-left">
              Two-Factor Authentication
            </button>
            <button className="w-full btn-outline text-left">
              Session Management
            </button>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">Database Status</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                Connected
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">API Status</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                Operational
              </span>
            </div>
            
            <button className="w-full btn-outline text-left">
              Export Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage