export const requireAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  
  req.flash('error', 'Please log in to access the admin panel');
  res.redirect('/auth/login');
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', 'Authentication required');
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      req.flash('error', 'Insufficient permissions');
      return res.redirect('/dashboard');
    }
    
    next();
  };
};