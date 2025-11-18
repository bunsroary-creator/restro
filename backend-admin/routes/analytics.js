import express from 'express';
import apiService from '../services/api.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Analytics page
router.get('/', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const [salesTrends, popularItems] = await Promise.all([
      apiService.getSalesTrends(req.session.token, period),
      apiService.getPopularItems(req.session.token)
    ]);

    res.render('analytics/index', {
      title: 'Analytics',
      salesTrends: salesTrends.data,
      popularItems: popularItems.data,
      selectedPeriod: period
    });
  } catch (error) {
    console.error('Analytics error:', error);
    req.flash('error', 'Failed to load analytics data');
    res.render('analytics/index', {
      title: 'Analytics',
      salesTrends: [],
      popularItems: [],
      selectedPeriod: '7d'
    });
  }
});

export default router;