// Improved admin middleware for lab-final
// - supports session-based admin login
// - renders a login page for GET requests when not authenticated

const adminOnly = (req, res, next) => {
  // allow if session user is admin
  if (req.session && req.session.user && req.session.user.email === 'admin@shop.com') {
    return next();
  }

  // If this is a GET request, render the login page so admins can enter credentials
  if (req.method === 'GET') {
    return res.render('lab-final/admin-login', { error: null, redirect: req.originalUrl });
  }

  // For non-GET requests (API calls), try to read credentials from body/query
  const email = req.body && req.body.email ? req.body.email : (req.query && req.query.email ? req.query.email : null);
  if (!email || email !== 'admin@shop.com') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin credentials required.' });
  }

  // set session so subsequent requests are authenticated
  req.session.user = { email };
  next();
};

module.exports = {
  adminOnly
};
