import express from 'express';
import apiService from '../services/api.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Users list
router.get('/', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { role, page = 1 } = req.query;
    const users = await apiService.getUsers(req.session.token, {
      role,
      page,
      limit: 20
    });

    res.render('users/index', {
      title: 'User Management',
      users: users.data,
      filters: { role },
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Users error:', error);
    req.flash('error', 'Failed to load users');
    res.render('users/index', {
      title: 'User Management',
      users: [],
      filters: {},
      currentPage: 1
    });
  }
});

// Update user role
router.put('/:id/role', requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    await apiService.updateUserRole(req.session.token, req.params.id, role);
    req.flash('success', 'User role updated successfully');
    res.redirect('/users');
  } catch (error) {
    console.error('User role update error:', error);
    req.flash('error', error.response?.data?.message || 'Failed to update user role');
    res.redirect('/users');
  }
});

export default router;