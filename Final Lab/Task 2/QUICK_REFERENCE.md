# 🚀 Task 2 Quick Reference Guide

## What Was Implemented

### ✅ 3 Middleware Functions Created

| Middleware | Purpose | Returns | File |
|-----------|---------|---------|------|
| `checkCartNotEmpty` | Prevent order with empty cart | 400 JSON | [middleware/auth.js](middleware/auth.js) |
| `adminOnly` | Admin access control | 403 JSON | [middleware/auth.js](middleware/auth.js) |
| `checkCartNotEmptyRoute` | Prevent page view with empty cart | Error page | [middleware/auth.js](middleware/auth.js) |

---

## Where Middleware is Applied

### 1. POST /create-order Route
**File:** [routes/orders.js](routes/orders.js) - Line 8  
**Middleware:** `checkCartNotEmpty`  
**Effect:** Can't create order with empty cart

```javascript
router.post('/create-order', checkCartNotEmpty, async (req, res) => {
    // Protected: checkCartNotEmpty runs first
});
```

### 2. GET /checkout Route
**File:** [server.js](server.js) - Line 83  
**Middleware:** `checkCartNotEmptyRoute`  
**Effect:** Can't view checkout page with empty cart

```javascript
app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {
    // Protected: checkCartNotEmptyRoute runs first
});
```

---

## How It Works

### checkCartNotEmpty Flow
```
Request → Middleware checks req.session.cart
          ├─ Empty? → Return 400 error ❌
          └─ Has items? → Continue to handler ✅
```

### adminOnly Flow
```
Request → Middleware checks req.body.email
          ├─ Not admin@shop.com? → Return 403 error ❌
          └─ Is admin@shop.com? → Continue to handler ✅
```

---

## Testing

```bash
# Run all tests
node MIDDLEWARE_TEST.js
```

**Expected Output:**
- ✅ checkCartNotEmpty: Rejects empty, accepts full
- ✅ adminOnly: Rejects invalid, accepts admin@shop.com
- ✅ checkCartNotEmptyRoute: Rejects empty, accepts full

---

## Code Locations

- **Middleware definitions:** [middleware/auth.js](middleware/auth.js)
- **Route using checkCartNotEmpty:** [routes/orders.js](routes/orders.js) line 8
- **Route using checkCartNotEmptyRoute:** [server.js](server.js) line 83
- **Middleware imports in server:** [server.js](server.js) line 7
- **Middleware imports in routes:** [routes/orders.js](routes/orders.js) line 4

---

## Key Points

✅ Middleware prevents unauthorized/invalid requests  
✅ Centralized in one file for easy maintenance  
✅ Can be reused on any route  
✅ Proper HTTP status codes (400, 403)  
✅ Clear error messages  
✅ All tests passing  

---

## Status: ✅ COMPLETE AND TESTED
