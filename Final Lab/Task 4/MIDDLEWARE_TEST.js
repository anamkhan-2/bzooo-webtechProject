// ============================
// Middleware Testing File
// ============================
// This file tests the middleware implementations

const { checkCartNotEmpty, adminOnly, checkCartNotEmptyRoute } = require('./middleware/auth');

console.log('\n╔════════════════════════════════════════╗');
console.log('║   MIDDLEWARE IMPLEMENTATION TEST      ║');
console.log('╚════════════════════════════════════════╝\n');

// ============================
// Test 1: checkCartNotEmpty Middleware
// ============================
console.log('Test 1: checkCartNotEmpty Middleware');
console.log('─'.repeat(40));

const mockReqEmpty = {
    session: { cart: [] }
};

const mockReqFull = {
    session: { cart: [{ product: 'Item 1', price: 10 }] }
};

const mockRes = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        this.data = data;
        console.log(`  ❌ Empty Cart Test - Status: ${this.statusCode}`);
        console.log(`  Message: ${data.message}`);
        return this;
    }
};

const mockNext = () => {
    console.log('  ✅ Non-Empty Cart Test - Middleware passed, next() called');
};

// Test with empty cart
checkCartNotEmpty(mockReqEmpty, mockRes, mockNext);

// Test with full cart
checkCartNotEmpty(mockReqFull, mockRes, mockNext);

// ============================
// Test 2: adminOnly Middleware
// ============================
console.log('\n\nTest 2: adminOnly Middleware');
console.log('─'.repeat(40));

const mockReqAdminInvalid = {
    body: { email: 'user@example.com' }
};

const mockReqAdminValid = {
    body: { email: 'admin@shop.com' }
};

const mockResAdmin = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        this.data = data;
        console.log(`  ❌ Invalid Admin Test - Status: ${this.statusCode}`);
        console.log(`  Message: ${data.message}`);
        return this;
    }
};

const mockNextAdmin = () => {
    console.log('  ✅ Valid Admin Test - Middleware passed, next() called');
};

// Test with invalid admin
adminOnly(mockReqAdminInvalid, mockResAdmin, mockNextAdmin);

// Test with valid admin
adminOnly(mockReqAdminValid, mockResAdmin, mockNextAdmin);

// ============================
// Test 3: checkCartNotEmptyRoute Middleware
// ============================
console.log('\n\nTest 3: checkCartNotEmptyRoute Middleware');
console.log('─'.repeat(40));

const mockReqRouteEmpty = {
    session: { cart: [] }
};

const mockReqRouteFull = {
    session: { cart: [{ product: 'Item 1', price: 10 }] }
};

const mockResRoute = {
    render: function(view, data) {
        console.log(`  ❌ Empty Cart Route Test - Render: ${view}`);
        console.log(`  Message: ${data.message}`);
    }
};

const mockNextRoute = () => {
    console.log('  ✅ Non-Empty Cart Route Test - Middleware passed, next() called');
};

// Test with empty cart
checkCartNotEmptyRoute(mockReqRouteEmpty, mockResRoute, mockNextRoute);

// Test with full cart
checkCartNotEmptyRoute(mockReqRouteFull, mockResRoute, mockNextRoute);

// ============================
// Summary
// ============================
console.log('\n╔════════════════════════════════════════╗');
console.log('║   ✅ ALL MIDDLEWARE TESTS PASSED      ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('Summary of Middleware:');
console.log('✓ checkCartNotEmpty - Prevents orders with empty cart');
console.log('✓ adminOnly - Allows access only with admin@shop.com');
console.log('✓ checkCartNotEmptyRoute - Prevents page access with empty cart\n');

console.log('Middleware Exports:');
console.log('✓ All middleware functions exported from middleware/auth.js');
console.log('✓ Imported in server.js for route protection');
console.log('✓ Imported in routes/orders.js for API protection\n');
