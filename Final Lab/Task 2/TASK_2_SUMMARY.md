# Task 2: Middleware for Validation & Authorization

## 📋 Task Overview

This task implements reusable middleware for validation and authorization in the Zoo Store checkout system, extending the functionality from Task 1.

## ✅ Requirements Completed

### 1. Create Middleware: `checkCartNotEmpty`
- **Status:** ✅ Implemented
- **Location:** `middleware/auth.js`
- **Purpose:** Prevent checkout when cart is empty
- **Behavior:** 
  - Checks if session cart exists and has items
  - Returns 400 error with message if empty
  - Allows request to proceed if cart has items

### 2. Create Middleware: `adminOnly`
- **Status:** ✅ Implemented
- **Location:** `middleware/auth.js`
- **Purpose:** Allow access only if email equals admin@shop.com
- **Behavior:**
  - Extracts email from request body
  - Verifies email === 'admin@shop.com'
  - Returns 403 Forbidden if not admin
  - Allows request to proceed if admin

### 3. Apply Middleware to Relevant Routes
- **Status:** ✅ Implemented
- **Routes Protected:**
  - `POST /create-order` → Uses `checkCartNotEmpty` middleware
  - `GET /checkout` → Uses `checkCartNotEmptyRoute` middleware

## 📁 Project Structure

```
Task 2/
├── css/                              # Stylesheets
├── js/
│   └── checkout.js                  # Form validation & order submission
├── middleware/
│   └── auth.js                      # ✨ NEW - Middleware definitions
├── models/
│   └── Order.js                     # MongoDB Order schema
├── routes/
│   └── orders.js                    # ✨ UPDATED - Uses middleware
├── views/
│   ├── checkout.ejs
│   ├── order-confirmation.ejs
│   ├── index.ejs
│   └── error.ejs
├── checkout.html
├── package.json
├── package-lock.json
├── README.md
├── server.js                        # ✨ UPDATED - Imports & applies middleware
├── MIDDLEWARE_DOCUMENTATION.md      # ✨ NEW - Detailed documentation
└── MIDDLEWARE_EXAMPLES.js           # ✨ NEW - Usage examples
```

## 🔧 Middleware Details

### checkCartNotEmpty
**Used for:** JSON responses (API routes)

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

**Applied to:** `POST /create-order`

---

### checkCartNotEmptyRoute
**Used for:** Page rendering (GET routes)

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

**Applied to:** `GET /checkout`

---

### adminOnly
**Used for:** Admin-only operations

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

**Can be applied to:** Admin routes (example usage in MIDDLEWARE_EXAMPLES.js)

## 🚀 How to Use

### 1. Importing Middleware
```javascript
// In server.js
const { checkCartNotEmptyRoute, adminOnly } = require('./middleware/auth');

// In routes/orders.js
const { checkCartNotEmpty } = require('../middleware/auth');
```

### 2. Applying Middleware to Routes
```javascript
// Single middleware
app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {
    // Handler code
});

// Multiple middleware (executed left to right)
app.post('/create-order', checkCartNotEmpty, async (req, res) => {
    // Handler code
});
```

### 3. Chaining Middleware
```javascript
app.post('/sensitive-route', 
    checkCartNotEmpty,      // First check
    adminOnly,              // Then check
    (req, res) => {
        // Handler only executes if both middleware pass
    }
);
```

## 🧪 Testing the Middleware

### Test Case 1: Empty Cart - JSON Response
```bash
# Setup: Clear cart from session
# Action: POST /create-order with empty cart
# Expected: 
#   Status: 400
#   Response: { success: false, message: "Your cart is empty..." }
```

### Test Case 2: Empty Cart - Page Render
```bash
# Setup: Clear cart from session
# Action: GET /checkout
# Expected:
#   Status: 200
#   Response: Error page rendered
#   Message: "Your cart is empty..."
```

### Test Case 3: Non-Admin User
```bash
# Setup: POST request with email !== admin@shop.com
# Expected:
#   Status: 403
#   Response: { success: false, message: "Access denied..." }
```

### Test Case 4: Admin User
```bash
# Setup: POST request with email = admin@shop.com
# Expected:
#   Status: 200
#   Response: Proceed to handler
```

## 📊 Middleware Flow Diagram

```
Request comes in
    ↓
Middleware chain executes (left to right)
    ↓
┌─────────────────────────────────────────┐
│ checkCartNotEmpty / checkCartNotEmptyRoute
│   - Check if cart exists
│   - Check if cart is not empty
│   - If empty: Return error, don't call next()
│   - If has items: Call next() to proceed
└─────────────────────────────────────────┘
    ↓ (if empty, stops here)
┌─────────────────────────────────────────┐
│ adminOnly (if applied)
│   - Extract email from request
│   - Check if email === 'admin@shop.com'
│   - If not admin: Return 403, don't call next()
│   - If admin: Call next() to proceed
└─────────────────────────────────────────┘
    ↓ (if not admin, stops here)
Route Handler executes
    ↓
Response sent to client
```

## 🎯 Benefits

✅ **Reusable** - One middleware definition, apply to multiple routes
✅ **Maintainable** - Centralized validation logic, easy to modify
✅ **Secure** - Prevents unauthorized access to protected operations
✅ **Clean** - Separates concerns from main route handlers
✅ **Testable** - Each middleware can be tested independently
✅ **Scalable** - Easy to add new middleware as needed

## 📝 Files Modified

1. **middleware/auth.js** - NEW
   - Contains checkCartNotEmpty, checkCartNotEmptyRoute, adminOnly

2. **routes/orders.js** - UPDATED
   - Imports checkCartNotEmpty
   - Applies to POST /create-order

3. **server.js** - UPDATED
   - Imports checkCartNotEmptyRoute and adminOnly
   - Applies checkCartNotEmptyRoute to GET /checkout

## 📚 Additional Resources

- See `MIDDLEWARE_DOCUMENTATION.md` for detailed documentation
- See `MIDDLEWARE_EXAMPLES.js` for usage examples
- See `routes/orders.js` for route-level middleware usage
- See `server.js` for server-level middleware application

## 🔐 Security Considerations

- **checkCartNotEmpty:** Prevents edge cases where someone tries to create an order with empty cart
- **adminOnly:** Simple email-based authorization; in production, use JWT tokens or session-based auth
- **Best Practice:** Combine multiple middleware for layered security

## 🚀 Future Enhancements

1. Add authentication middleware (JWT tokens)
2. Add role-based authorization (multiple admin levels)
3. Add rate limiting middleware
4. Add request validation middleware
5. Add logging and monitoring middleware

---

**Status:** ✅ Task 2 - Middleware Implementation Complete
