/**
 * ============================
 * MIDDLEWARE APPLICATION REFERENCE
 * ============================
 * 
 * This file shows where and how middleware is applied
 */

// ============================================
// 1. MIDDLEWARE DEFINITIONS
// ============================================
// Location: middleware/auth.js

/*
const checkCartNotEmpty = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Your cart is empty. Please add items to your cart before checkout.'
        });
    }
    next();
};

const checkCartNotEmptyRoute = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.render('error', {
            message: 'Your cart is empty. Please add items to your cart before checkout.'
        });
    }
    next();
};

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

module.exports = {
    checkCartNotEmpty,
    adminOnly,
    checkCartNotEmptyRoute
};
*/

// ============================================
// 2. SERVER-LEVEL MIDDLEWARE APPLICATION
// ============================================
// Location: server.js (lines 1-8)

/*
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ordersRouter = require('./routes/orders');
const { checkCartNotEmptyRoute, adminOnly } = require('./middleware/auth');  // ← IMPORT HERE

const app = express();
*/

// Applied to checkout route (server.js, around line 83):
/*
app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {  // ← MIDDLEWARE APPLIED
    const subtotal = req.session.cart.reduce((sum, item) => sum + item.subtotal, 0);
    const shipping = 9.99;
    const tax = subtotal * 0.10;
    const totalAmount = subtotal + shipping + tax;

    res.render('checkout', {
        cart: req.session.cart,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
    });
});
*/

// ============================================
// 3. ROUTE-LEVEL MIDDLEWARE APPLICATION
// ============================================
// Location: routes/orders.js (lines 1-8)

/*
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { checkCartNotEmpty } = require('../middleware/auth');  // ← IMPORT HERE

// POST route to create order
router.post('/create-order', checkCartNotEmpty, async (req, res) => {  // ← MIDDLEWARE APPLIED
    try {
        const { customerName, email } = req.body;
        
        // ... rest of handler code ...
    } catch (error) {
        // ... error handling ...
    }
});
*/

// ============================================
// 4. MIDDLEWARE EXECUTION ORDER
// ============================================

/*
When user makes a request:

1. Request arrives at server
   └─> Express matches the route

2. Middleware executes (left to right)
   
   Example: app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {})
   
   Step 1: checkCartNotEmptyRoute middleware executes
           - Checks if session.cart exists and is not empty
           - If empty:    renders error page, execution stops
           - If has items: calls next(), proceeds to route handler
   
   Step 2: Route handler executes (only if middleware passed)
           - Renders checkout page with cart data

3. Response sent to client

IMPORTANT: If middleware doesn't call next(), the chain stops!
*/

// ============================================
// 5. EXAMPLE: HOW MIDDLEWARE PREVENTS ERRORS
// ============================================

/*
SCENARIO 1: Without Middleware
├─ User tries POST /create-order with empty cart
├─ Route handler tries: req.session.cart.reduce(...)
├─ ERROR: Cannot read property 'reduce' of undefined
└─ User sees 500 error

SCENARIO 2: With checkCartNotEmpty Middleware
├─ Middleware checks: req.session.cart.length === 0
├─ Middleware returns: 400 error with message
├─ Route handler NEVER EXECUTES
└─ User sees friendly error message
*/

// ============================================
// 6. TESTING MIDDLEWARE BEHAVIOR
// ============================================

/*
Test 1: Cart is empty
├─ Clear session.cart: req.session.cart = []
├─ Make request to GET /checkout
├─ Middleware detects empty cart
├─ Middleware calls: res.render('error', { message: '...' })
├─ Middleware does NOT call: next()
├─ Result: Error page shown, handler NOT executed
└─ Status: ✓ WORKING

Test 2: Cart has items
├─ Populate session.cart with items
├─ Make request to GET /checkout
├─ Middleware checks: cart.length > 0
├─ Middleware calls: next()
├─ Route handler executes
├─ Result: Checkout page shown with cart data
└─ Status: ✓ WORKING

Test 3: Admin access
├─ Make POST request with email: "admin@shop.com"
├─ adminOnly middleware checks email
├─ Email matches, middleware calls: next()
├─ Route handler executes
├─ Result: Admin operation completes
└─ Status: ✓ WORKING

Test 4: Non-admin access
├─ Make POST request with email: "user@email.com"
├─ adminOnly middleware checks email
├─ Email doesn't match, middleware returns: 403 error
├─ Middleware does NOT call: next()
├─ Result: 403 Forbidden, handler NOT executed
└─ Status: ✓ WORKING
*/

// ============================================
// 7. MIDDLEWARE PATTERNS
// ============================================

/*
PATTERN 1: Single Middleware
app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {});

PATTERN 2: Multiple Middleware (Chained)
app.post('/admin-action', 
    checkCartNotEmpty,      // Check 1
    adminOnly,              // Check 2
    (req, res) => {}        // Handler (runs only if both checks pass)
);

PATTERN 3: Global Middleware
app.use(checkCartNotEmptyRoute);  // Applied to ALL routes

PATTERN 4: Path-based Middleware
app.use('/admin', adminOnly);  // Applied to all /admin/* routes

PATTERN 5: Conditional Middleware
if (process.env.NODE_ENV === 'production') {
    app.use(adminOnly);
}
*/

// ============================================
// 8. BEST PRACTICES
// ============================================

/*
✓ DO:
  - Import middleware at top of file
  - Apply middleware closest to where it's needed
  - Chain middleware in logical order (general → specific)
  - Use descriptive middleware names
  - Centralize middleware definitions
  - Test middleware independently

✗ DON'T:
  - Apply middleware globally if not needed by all routes
  - Create middleware in route files (separate concerns)
  - Forget to call next() (unless intentionally stopping)
  - Chain middleware in wrong order
  - Duplicate middleware logic across routes
*/

module.exports = {
    // This is a reference file
    // Actual middleware is in middleware/auth.js
};
