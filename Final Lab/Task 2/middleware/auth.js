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
    const { email } = req.body;

    if (!email || email !== 'admin@shop.com') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin credentials required.'
        });
    }
    next();
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
