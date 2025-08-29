import express from 'express';
import Joi from 'joi';
import { supabase } from '../config/database.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin/manager only)
router.get('/', authenticateToken, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('users')
      .select('id, email, full_name, phone, role, created_at, last_login')
      .order('created_at', { ascending: false });

    if (role) query = query.eq('role', role);

    const { data: users, error } = await query.range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const updateSchema = Joi.object({
      full_name: Joi.string().min(2),
      phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
      email: Joi.string().email()
    });

    const { error: validationError, value } = updateSchema.validate(req.body);
    if (validationError) throw validationError;

    const { data: user, error } = await supabase
      .from('users')
      .update(value)
      .eq('id', req.user.id)
      .select('id, email, full_name, phone, role, created_at')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['customer', 'staff', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, email, full_name, phone, role')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

export default router;