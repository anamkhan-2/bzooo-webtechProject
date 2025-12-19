const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ordersRouter = require('./routes/orders');

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

// Routes
app.use('/', ordersRouter);

// Checkout page
app.get('/checkout', (req, res) => {
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
