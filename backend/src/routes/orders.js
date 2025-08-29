import express from 'express';
import Joi from 'joi';
import { supabase } from '../config/database.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { generateOTP, sendOTPSMS } from '../utils/otp.js';

const router = express.Router();

// Validation schemas
const createOrderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    menu_item_id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required(),
    special_instructions: Joi.string().allow('')
  })).min(1).required(),
  order_type: Joi.string().valid('pickup', 'delivery').required(),
  delivery_address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postal_code: Joi.string().required(),
    phone: Joi.string().required()
  }).when('order_type', { is: 'delivery', then: Joi.required() }),
  special_notes: Joi.string().allow(''),
  phone: Joi.string().required()
});

// Create order
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error: validationError, value } = createOrderSchema.validate(req.body);
    if (validationError) throw validationError;

    const { items, order_type, delivery_address, special_notes, phone } = value;

    // Calculate total
    const menuItemIds = items.map(item => item.menu_item_id);
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, price')
      .in('id', menuItemIds);

    if (menuError) throw menuError;

    const total = items.reduce((sum, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
      return sum + (menuItem.price * item.quantity);
    }, 0);

    // Generate OTP
    const otp = generateOTP();

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        order_type,
        status: 'pending',
        total_amount: total,
        delivery_address: order_type === 'delivery' ? delivery_address : null,
        special_notes,
        phone,
        otp_code: otp,
        otp_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      special_instructions: item.special_instructions
    }));

    await supabase.from('order_items').insert(orderItems);

    // Send OTP SMS
    await sendOTPSMS(phone, otp);

    res.status(201).json({
      success: true,
      message: 'Order created successfully. OTP sent to your phone.',
      data: {
        order_id: order.id,
        total_amount: total,
        estimated_time: order_type === 'pickup' ? 25 : 45
      }
    });
  } catch (error) {
    next(error);
  }
});

// Verify OTP
router.post('/:id/verify-otp', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.otp_code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > new Date(order.otp_expires_at)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Update order status
    await supabase
      .from('orders')
      .update({ 
        status: 'confirmed', 
        confirmed_at: new Date().toISOString(),
        otp_code: null,
        otp_expires_at: null
      })
      .eq('id', id);

    res.json({
      success: true,
      message: 'Order confirmed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          menu_item:menu_items(*)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// Get all orders (staff/manager/admin)
router.get('/', authenticateToken, authorize('staff', 'manager', 'admin'), async (req, res, next) => {
  try {
    const { status, order_type, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:users(full_name, phone, email),
        order_items(
          *,
          menu_item:menu_items(name, price)
        )
      `)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (order_type) query = query.eq('order_type', order_type);

    const { data: orders, error } = await query.range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// Update order status (staff/manager/admin)
router.put('/:id/status', authenticateToken, authorize('staff', 'manager', 'admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

export default router;