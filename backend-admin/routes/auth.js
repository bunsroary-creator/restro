import express from 'express';
import { body, validationResult } from 'express-validator';
import apiService from '../services/api.js';

const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { title: 'Admin Login' });
});

// Login handler
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/auth/login');
    }

    const { email, password } = req.body;
    const response = await apiService.login(email, password);
    
    const user = response.data.user;
    const token = response.data.token;

    // Check if user has admin privileges
    if (!['admin', 'manager', 'staff'].includes(user.role)) {
      req.flash('error', 'Access denied. Admin privileges required.');
      return res.redirect('/auth/login');
    }

    // Store user and token in session
    req.session.user = user;
    req.session.token = token;

    req.flash('success', `Welcome back, ${user.full_name}!`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', error.response?.data?.message || 'Login failed');
    res.redirect('/auth/login');
  }
});

// Logout handler
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

export default router;