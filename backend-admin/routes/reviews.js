import express from 'express';
import apiService from '../services/api.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Reviews list
router.get('/', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { status, page = 1 } = req.query;
    const reviews = await apiService.getReviews(req.session.token, {
      status,
      page,
      limit: 20
    });

    res.render('reviews/index', {
      title: 'Review Management',
      reviews: reviews.data,
      filters: { status },
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Reviews error:', error);
    req.flash('error', 'Failed to load reviews');
    res.render('reviews/index', {
      title: 'Review Management',
      reviews: [],
      filters: {},
      currentPage: 1
    });
  }
});

// Moderate review
router.put('/:id/moderate', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { status } = req.body;
    await apiService.moderateReview(req.session.token, req.params.id, status);
    req.flash('success', `Review ${status} successfully`);
    res.redirect('/reviews');
  } catch (error) {
    console.error('Review moderation error:', error);
    req.flash('error', error.response?.data?.message || 'Failed to moderate review');
    res.redirect('/reviews');
  }
});

export default router;