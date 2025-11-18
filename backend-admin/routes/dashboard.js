import express from 'express';
import apiService from '../services/api.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const stats = await apiService.getDashboardStats(req.session.token);
    const recentOrders = await apiService.getOrders(req.session.token, { limit: 5 });
    
    res.render('dashboard/index', {
      title: 'Dashboard',
      stats: stats.data,
      recentOrders: recentOrders.data
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Failed to load dashboard data');
    res.render('dashboard/index', {
      title: 'Dashboard',
      stats: null,
      recentOrders: []
    });
  }
});

export default router;