import express from 'express';
import apiService from '../services/api.js';

const router = express.Router();

// Orders list
router.get('/', async (req, res) => {
  try {
    const { status, order_type, page = 1 } = req.query;
    const orders = await apiService.getOrders(req.session.token, {
      status,
      order_type,
      page,
      limit: 20
    });

    res.render('orders/index', {
      title: 'Order Management',
      orders: orders.data,
      filters: { status, order_type },
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Orders error:', error);
    req.flash('error', 'Failed to load orders');
    res.render('orders/index', {
      title: 'Order Management',
      orders: [],
      filters: {},
      currentPage: 1
    });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await apiService.updateOrderStatus(req.session.token, req.params.id, status);
    req.flash('success', 'Order status updated successfully');
    res.redirect('/orders');
  } catch (error) {
    console.error('Order status update error:', error);
    req.flash('error', error.response?.data?.message || 'Failed to update order status');
    res.redirect('/orders');
  }
});

export default router;