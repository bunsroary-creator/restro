import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authenticateToken, authorize('staff', 'manager', 'admin'), async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    // Today's orders
    const { data: todayOrders, error: todayError } = await supabase
      .from('orders')
      .select('total_amount, status')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);

    if (todayError) throw todayError;

    // Total customers
    const { count: totalCustomers, error: customersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    if (customersError) throw customersError;

    // Average rating
    const { data: avgRating, error: ratingError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('status', 'approved');

    if (ratingError) throw ratingError;

    const averageRating = avgRating.length > 0 
      ? avgRating.reduce((sum, review) => sum + review.rating, 0) / avgRating.length 
      : 0;

    res.json({
      success: true,
      data: {
        todayStats: {
          orders: todayOrders.length,
          revenue: todayOrders.reduce((sum, order) => sum + order.total_amount, 0),
          pendingOrders: todayOrders.filter(order => order.status === 'pending').length
        },
        totalCustomers,
        averageRating: Math.round(averageRating * 10) / 10,
        ordersByStatus: {
          pending: todayOrders.filter(order => order.status === 'pending').length,
          confirmed: todayOrders.filter(order => order.status === 'confirmed').length,
          preparing: todayOrders.filter(order => order.status === 'preparing').length,
          ready: todayOrders.filter(order => order.status === 'ready').length,
          completed: todayOrders.filter(order => order.status === 'completed').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Sales trends
router.get('/sales-trends', authenticateToken, authorize('manager', 'admin'), async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate;
    if (period === '7d') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed');

    if (error) throw error;

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// Popular items
router.get('/popular-items', authenticateToken, authorize('manager', 'admin'), async (req, res, next) => {
  try {
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        menu_item_id,
        quantity,
        menu_item:menu_items(name, price)
      `);

    if (error) throw error;

    // Aggregate quantities by menu item
    const itemStats = {};
    orderItems.forEach(item => {
      const itemId = item.menu_item_id;
      if (!itemStats[itemId]) {
        itemStats[itemId] = {
          name: item.menu_item.name,
          price: item.menu_item.price,
          totalOrdered: 0
        };
      }
      itemStats[itemId].totalOrdered += item.quantity;
    });

    const sortedItems = Object.entries(itemStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.totalOrdered - a.totalOrdered)
      .slice(0, 10);

    res.json({
      success: true,
      data: sortedItems
    });
  } catch (error) {
    next(error);
  }
});

export default router;