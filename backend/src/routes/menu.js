import express from 'express';
import Joi from 'joi';
import { supabase } from '../config/database.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const menuItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  category_id: Joi.string().uuid().required(),
  spice_level: Joi.number().integer().min(0).max(5).default(0),
  is_vegetarian: Joi.boolean().default(false),
  is_vegan: Joi.boolean().default(false),
  ingredients: Joi.array().items(Joi.string()).default([]),
  image_url: Joi.string().uri().allow(''),
  is_available: Joi.boolean().default(true)
});

// Get all menu items (public)
router.get('/items', async (req, res, next) => {
  try {
    const { 
      category, 
      spice_level, 
      is_vegetarian, 
      is_vegan, 
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_available', true);

    // Apply filters
    if (category) query = query.eq('category_id', category);
    if (spice_level) query = query.eq('spice_level', parseInt(spice_level));
    if (is_vegetarian === 'true') query = query.eq('is_vegetarian', true);
    if (is_vegan === 'true') query = query.eq('is_vegan', true);
    if (search) query = query.ilike('name', `%${search}%`);

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: items, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get categories (public)
router.get('/categories', async (req, res, next) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Create menu item (admin/manager only)
router.post('/items', authenticateToken, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { error: validationError, value } = menuItemSchema.validate(req.body);
    if (validationError) throw validationError;

    const { data: item, error } = await supabase
      .from('menu_items')
      .insert(value)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
});

// Update menu item (admin/manager only)
router.put('/items/:id', authenticateToken, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error: validationError, value } = menuItemSchema.validate(req.body);
    if (validationError) throw validationError;

    const { data: item, error } = await supabase
      .from('menu_items')
      .update(value)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
});

// Delete menu item (admin only)
router.delete('/items/:id', authenticateToken, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;