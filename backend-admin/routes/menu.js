import express from 'express';
import { body, validationResult } from 'express-validator';
import apiService from '../services/api.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Menu items list
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1 } = req.query;
    const [menuItems, categories] = await Promise.all([
      apiService.getMenuItems(req.session.token, {
        category,
        search,
        page,
        limit: 20
      }),
      apiService.getMenuCategories(req.session.token)
    ]);

    res.render('menu/index', {
      title: 'Menu Management',
      menuItems: menuItems.data,
      categories: categories.data,
      filters: { category, search },
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Menu error:', error);
    req.flash('error', 'Failed to load menu items');
    res.render('menu/index', {
      title: 'Menu Management',
      menuItems: [],
      categories: [],
      filters: {},
      currentPage: 1
    });
  }
});

// Create menu item form
router.get('/create', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const categories = await apiService.getMenuCategories(req.session.token);
    res.render('menu/create', {
      title: 'Add Menu Item',
      categories: categories.data
    });
  } catch (error) {
    console.error('Menu create error:', error);
    req.flash('error', 'Failed to load categories');
    res.redirect('/menu');
  }
});

// Create menu item handler
router.post('/', requireRole('admin', 'manager'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('category_id').notEmpty().withMessage('Category is required'),
  body('spice_level').isInt({ min: 0, max: 5 }).withMessage('Spice level must be between 0 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/menu/create');
    }

    const menuItemData = {
      ...req.body,
      price: parseFloat(req.body.price),
      spice_level: parseInt(req.body.spice_level),
      is_vegetarian: req.body.is_vegetarian === 'on',
      is_vegan: req.body.is_vegan === 'on',
      is_available: req.body.is_available === 'on',
      ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : []
    };

    await apiService.createMenuItem(req.session.token, menuItemData);
    req.flash('success', 'Menu item created successfully');
    res.redirect('/menu');
  } catch (error) {
    console.error('Menu create error:', error);
    req.flash('error', error.response?.data?.message || 'Failed to create menu item');
    res.redirect('/menu/create');
  }
});

// Edit menu item form
router.get('/:id/edit', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const [menuItems, categories] = await Promise.all([
      apiService.getMenuItems(req.session.token, { limit: 1000 }),
      apiService.getMenuCategories(req.session.token)
    ]);

    const menuItem = menuItems.data.find(item => item.id === req.params.id);
    if (!menuItem) {
      req.flash('error', 'Menu item not found');
      return res.redirect('/menu');
    }

    res.render('menu/edit', {
      title: 'Edit Menu Item',
      menuItem,
      categories: categories.data
    });
  } catch (error) {
    console.error('Menu edit error:', error);
    req.flash('error', 'Failed to load menu item');
    res.redirect('/menu');
  }
});

// Update menu item handler
router.put('/:id', requireRole('admin', 'manager'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('category_id').notEmpty().withMessage('Category is required'),
  body('spice_level').isInt({ min: 0, max: 5 }).withMessage('Spice level must be between 0 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/menu/${req.params.id}/edit`);
    }

    const menuItemData = {
      ...req.body,
      price: parseFloat(req.body.price),
      spice_level: parseInt(req.body.spice_level),
      is_vegetarian: req.body.is_vegetarian === 'on',
      is_vegan: req.body.is_vegan === 'on',
      is_available: req.body.is_available === 'on',
      ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : []
    };

    await apiService.updateMenuItem(req.session.token, req.params.id, menuItemData);
    req.flash('success', 'Menu item updated successfully');
    res.redirect('/menu');
  } catch (error) {
    console.error('Menu update error:', error);
    req.flash('error', error.response?.data?.message || 'Failed to update menu item');
    res.redirect(`/menu/${req.params.id}/edit`);
  }
});

// Delete menu item handler
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    await apiService.deleteMenuItem(req.session.token, req.params.id);
    req.flash('success', 'Menu item deleted successfully');
    res.redirect('/menu');
  } catch (error) {
    console.error('Menu delete error:', error);
    req.flash('error', error.response?.data?.message || 'Failed to delete menu item');
    res.redirect('/menu');
  }
});

export default router;