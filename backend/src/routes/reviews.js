import express from 'express';
import Joi from 'joi';
import { supabase } from '../config/database.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

const reviewSchema = Joi.object({
  order_id: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).allow(''),
  platform: Joi.string().valid('website', 'google', 'facebook').default('website')
});

// Create review
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { error: validationError, value } = reviewSchema.validate(req.body);
    if (validationError) throw validationError;

    // Check if order belongs to user and is completed
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', value.order_id)
      .eq('user_id', req.user.id)
      .eq('status', 'completed')
      .single();

    if (orderError || !order) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or not completed'
      });
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        ...value,
        user_id: req.user.id,
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// Get reviews (public)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:users(full_name)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (rating) query = query.eq('rating', parseInt(rating));

    const { data: reviews, error } = await query.range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// Moderate review (manager/admin)
router.put('/:id/moderate', authenticateToken, authorize('manager', 'admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .update({ status, moderated_by: req.user.id, moderated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Review moderated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

export default router;