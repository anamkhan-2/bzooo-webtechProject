// ============================
// Example: How to Use Middleware
// ============================

/*
This file demonstrates how to use the middleware created in middleware/auth.js

1. CHECKCARNOTTEMPTY MIDDLEWARE
   - Used in: POST /create-order route
   - Applied in: routes/orders.js
   - Effect: Prevents order creation when cart is empty

Example:
```javascript
// In routes/orders.js
const { checkCartNotEmpty } = require('../middleware/auth');

router.post('/create-order', checkCartNotEmpty, async (req, res) => {
    // This code only runs if cart is not empty
    // If cart is empty, middleware returns 400 error
});
```

2. CHECKCARTNOEMPTYROUTE MIDDLEWARE
   - Used in: GET /checkout route
   - Applied in: server.js
   - Effect: Prevents viewing checkout page when cart is empty

Example:
```javascript
// In server.js
const { checkCartNotEmptyRoute } = require('./middleware/auth');

app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {
    // This code only runs if cart is not empty
    // If cart is empty, renders error page
});
```

3. ADMINONLY MIDDLEWARE
   - Purpose: Protect admin-only routes
   - Can be applied to: Any route that requires admin access
   - Check: email === 'admin@shop.com'

Example:
```javascript
// In server.js or a dedicated admin route file
const { adminOnly } = require('./middleware/auth');

app.post('/admin/clear-orders', adminOnly, async (req, res) => {
    // This code only runs if email is admin@shop.com
    // Otherwise returns 403 Forbidden
});

app.delete('/admin/order/:id', adminOnly, async (req, res) => {
    // Delete order - admin only
});

app.get('/admin/dashboard', adminOnly, (req, res) => {
    // Admin dashboard - admin only
});
```

TESTING THE MIDDLEWARE:

Test 1: checkCartNotEmpty
- Endpoint: POST /create-order
- With empty cart:
  - Expected: 400 status, message "Your cart is empty..."
- With items in cart:
  - Expected: Order is created, 200 status with orderId

Test 2: checkCartNotEmptyRoute
- Endpoint: GET /checkout
- With empty cart:
  - Expected: Error page rendered, message "Your cart is empty..."
- With items in cart:
  - Expected: Checkout page displayed with form

Test 3: adminOnly
- Endpoint: POST /admin/action (example)
- Request body: { email: "user@email.com" }
  - Expected: 403 status, message "Access denied"
- Request body: { email: "admin@shop.com" }
  - Expected: 200 status, request proceeds

ADVANCED USAGE:

1. Chain Multiple Middleware:
```javascript
router.post('/sensitive-action', 
    checkCartNotEmpty,      // Check cart first
    adminOnly,              // Then check admin
    async (req, res) => {
        // Handle request
    }
);
```

2. Create Custom Middleware:
```javascript
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

module.exports = { isAuthenticated, ...otherMiddleware };
```

3. Apply Globally:
```javascript
// Apply to all routes that start with /admin
app.use('/admin', adminOnly);

// Now all /admin/* routes are protected
app.get('/admin/users', (req, res) => { });
app.post('/admin/settings', (req, res) => { });
```
*/

module.exports = {
    // This is just a documentation file
    // Import middleware from middleware/auth.js
};
