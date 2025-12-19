const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ordersRouter = require('./routes/orders');
const Ticket = require('./models/Ticket');
const { checkCartNotEmptyRoute, adminOnly } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/zoo-checkout', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => {
    console.error('✗ MongoDB connection error:', err);
    // Continue running even if MongoDB is not available for demo purposes
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'zoo-store-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize cart in session
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [
            {
                product: 'Lion Plush Toy',
                quantity: 2,
                price: 24.99,
                subtotal: 49.98
            },
            {
                product: 'Zoo Documentary DVD Set',
                quantity: 1,
                price: 29.99,
                subtotal: 29.99
            },
            {
                product: 'Animal Coloring Book',
                quantity: 3,
                price: 4.99,
                subtotal: 14.97
            },
            {
                product: 'Zoo Membership (1 Year)',
                quantity: 1,
                price: 99.99,
                subtotal: 99.99
            }
        ];
    }
    res.locals.cart = req.session.cart;
    next();
});

// Helper to recalculate cart totals on the server
function recalcCart(req) {
    if (!req.session.cart) req.session.cart = [];

    // Ensure each item has numeric price and quantity, update subtotal
    req.session.cart = req.session.cart.map(item => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        return Object.assign({}, item, {
            quantity: qty,
            price: price,
            subtotal: Number((qty * price).toFixed(2))
        });
    }).filter(item => item.quantity > 0 && item.price >= 0);

    const subtotal = req.session.cart.reduce((sum, item) => sum + item.subtotal, 0);
    const shipping = req.session.cart.length > 0 ? 9.99 : 0;
    const tax = Number((subtotal * 0.10).toFixed(2));
    const totalAmount = Number((subtotal + shipping + tax).toFixed(2));

    return { subtotal, shipping, tax, totalAmount };
}

// API: add item to cart (prevents duplicates by updating quantity)
app.post('/cart/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = Number(quantity) || 1;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'productId is required' });
        }

        // Fetch product from DB to get canonical name and price
        const ticket = await Ticket.findById(productId).lean();
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!req.session.cart) req.session.cart = [];

        // Check for existing product in cart by productId
        const existingIndex = req.session.cart.findIndex(i => String(i.productId) === String(productId));
        if (existingIndex !== -1) {
            // Update quantity and subtotal
            req.session.cart[existingIndex].quantity = Number(req.session.cart[existingIndex].quantity || 0) + qty;
            req.session.cart[existingIndex].price = ticket.price;
            req.session.cart[existingIndex].subtotal = Number((req.session.cart[existingIndex].quantity * ticket.price).toFixed(2));
        } else {
            // Add new item
            req.session.cart.push({
                productId: ticket._id,
                product: ticket.name,
                quantity: qty,
                price: ticket.price,
                subtotal: Number((qty * ticket.price).toFixed(2))
            });
        }

        const totals = recalcCart(req);
        res.json({ success: true, cart: req.session.cart, totals });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});

// API: return server-calculated cart summary
app.get('/cart/summary', (req, res) => {
    try {
        const totals = recalcCart(req);
        res.json({ success: true, cart: req.session.cart, totals });
    } catch (error) {
        console.error('Error getting cart summary:', error);
        res.status(500).json({ success: false, message: 'Error getting cart summary' });
    }
});

// Routes
app.use('/', ordersRouter);

// Checkout page - Protected with checkCartNotEmptyRoute middleware
app.get('/checkout', checkCartNotEmptyRoute, (req, res) => {
    const subtotal = req.session.cart.reduce((sum, item) => sum + item.subtotal, 0);
    const shipping = 9.99;
    const tax = subtotal * 0.10; // 10% tax
    const totalAmount = subtotal + shipping + tax;

    res.render('checkout', {
        cart: req.session.cart,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
    });
});

// Order confirmation page
app.get('/order-confirmation/:orderId', async (req, res) => {
    try {
        const Order = require('./models/Order');
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).render('error', {
                message: 'Order not found'
            });
        }

        res.render('order-confirmation', { order });
    } catch (error) {
        res.status(500).render('error', {
            message: 'Error retrieving order details'
        });
    }
});

// Cart page - Protected with checkCartNotEmptyRoute for cart operations
// Cart page
app.get('/cart', (req, res) => {
    const subtotal = req.session.cart.reduce((sum, item) => sum + item.subtotal, 0);
    res.render('cart', {
        cart: req.session.cart,
        subtotal: subtotal.toFixed(2)
    });
});

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        cartCount: req.session.cart.length
    });
});

// Error page
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: 'An error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  Zoo Store Checkout System Running   ║`);
    console.log(`╠════════════════════════════════════════╣`);
    console.log(`║  http://localhost:${PORT}                 ║`);
    console.log(`║  Checkout: http://localhost:${PORT}/checkout ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
});
