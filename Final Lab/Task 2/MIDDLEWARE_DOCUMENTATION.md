# Task 2: Middleware for Validation & Authorization

## Objective
Implement reusable middleware for validation and authorization.

## Requirements Met

### 1. **checkCartNotEmpty Middleware**
- **Location:** `middleware/auth.js`
- **Purpose:** Prevent checkout when cart is empty
- **Functionality:**
  - Checks if `req.session.cart` exists and is not empty
  - Returns 400 error with message if cart is empty
  - Allows request to proceed if cart has items
  
**Usage:**
```javascript
// In routes/orders.js
router.post('/create-order', checkCartNotEmpty, async (req, res) => {
    // Handle order creation
});

// In server.js for routes
app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {
    // Render checkout page
});
```

### 2. **adminOnly Middleware**
- **Location:** `middleware/auth.js`
- **Purpose:** Allow access only if email equals admin@shop.com
- **Functionality:**
  - Extracts email from request body
  - Verifies email matches admin@shop.com
  - Returns 403 Forbidden if credentials don't match
  - Allows request to proceed if credentials are valid

**Usage:**
```javascript
// Can be applied to admin routes
router.post('/admin-action', adminOnly, (req, res) => {
    // Perform admin action
});
```

### 3. **Middleware Application**

#### Applied to Checkout Route
- **Route:** `POST /create-order`
- **Middleware:** `checkCartNotEmpty`
- **Protection:** Prevents order creation when cart is empty

#### Applied to Checkout Page
- **Route:** `GET /checkout`
- **Middleware:** `checkCartNotEmptyRoute`
- **Protection:** Prevents viewing checkout page with empty cart

## Folder Structure
```
Task 2/
├── css/
├── js/
├── middleware/
│   └── auth.js              (✓ NEW - Middleware definitions)
├── models/
│   └── Order.js
├── routes/
│   └── orders.js            (✓ UPDATED - Uses checkCartNotEmpty)
├── views/
├── checkout.html
├── package.json
├── package-lock.json
├── README.md
└── server.js                (✓ UPDATED - Imports & applies middleware)
```

## Middleware Details

### checkCartNotEmpty
```javascript
const checkCartNotEmpty = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Your cart is empty. Please add items to your cart before checkout.'
        });
    }
    next();
};
```

### checkCartNotEmptyRoute
```javascript
const checkCartNotEmptyRoute = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.render('error', {
            message: 'Your cart is empty. Please add items to your cart before checkout.'
        });
    }
    next();
};
```

### adminOnly
```javascript
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
```

## Testing the Middleware

### Test checkCartNotEmpty
1. Clear cart from session
2. Try to POST to `/create-order`
3. Should receive 400 error: "Your cart is empty"

### Test checkCartNotEmptyRoute
1. Clear cart from session
2. Try to GET `/checkout`
3. Should see error page: "Your cart is empty"

### Test adminOnly
1. POST request with email != admin@shop.com
2. Should receive 403 error: "Access denied"
3. POST request with email = admin@shop.com
4. Should be allowed to proceed

## Benefits
✓ **Reusable** - Middleware can be applied to multiple routes
✓ **Maintainable** - Centralized validation logic
✓ **Secure** - Protects sensitive operations
✓ **Clean** - Separates concerns from route handlers
✓ **Testable** - Each middleware can be tested independently
