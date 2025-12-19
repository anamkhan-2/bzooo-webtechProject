// ============================
// Middleware: Check Cart Not Empty
// ============================
// Prevent checkout when cart is empty
const checkCartNotEmpty = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Your cart is empty. Please add items to your cart before checkout.'
        });
    }
    next();
};

// ============================
// Middleware: Admin Only
// ============================
// Allow access only if email equals admin@shop.com
const adminOnly = (req, res, next) => {
    // If GET request and email provided as query param, allow through
    if (req.method === 'GET') {
        const email = req.query.email;
        if (email && email === 'admin@shop.com') {
            return next();
        }

        // No valid email in query -> render a simple admin login page so user can enter credentials
        return res.render('lab-final/admin-login', { error: null, redirect: req.originalUrl });
    }

    // If non-GET (e.g., POST from login form), read email from body and redirect with query if valid
    const email = req.body && req.body.email ? req.body.email : null;
    if (!email || email !== 'admin@shop.com') {
        // Re-render login with error message for POST submissions
        return res.render('lab-final/admin-login', { error: 'Invalid admin credentials', redirect: req.originalUrl });
    }

    // Valid credentials submitted — redirect to the original URL with email in query so subsequent GET is allowed
    const redirectTo = req.body.redirect || req.originalUrl || '/admin';
    return res.redirect(redirectTo.includes('?') ? `${redirectTo}&email=${encodeURIComponent(email)}` : `${redirectTo}?email=${encodeURIComponent(email)}`);
};

// ============================
// Middleware: Check Cart Not Empty (for routes)
// ============================
// Alternative version that checks in middleware context
const checkCartNotEmptyRoute = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.render('error', {
            message: 'Your cart is empty. Please add items to your cart before checkout.'
        });
    }
    next();
};

module.exports = {
    checkCartNotEmpty,
    adminOnly,
    checkCartNotEmptyRoute
};
