const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
const { checkCartNotEmpty } = require('../middleware/auth');

// POST route to create order
// Apply checkCartNotEmpty middleware to prevent checkout with empty cart
router.post('/create-order', checkCartNotEmpty, async (req, res) => {
    try {
        const { customerName, email } = req.body;

        if (!customerName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Customer name and email are required'
            });
        }

        // Recalculate totals on the server to prevent tampering
        const cartItems = req.session.cart || [];

        // Basic validation: each item must have numeric price and positive quantity
        for (const item of cartItems) {
            if (typeof item.price === 'undefined' || isNaN(Number(item.price)) || Number(item.quantity) <= 0) {
                return res.status(400).json({ success: false, message: 'Cart contains invalid items. Please review your cart.' });
            }
        }

        const recalculatedSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
        const shipping = cartItems.length > 0 ? 9.99 : 0;
        const tax = Number((recalculatedSubtotal * 0.10).toFixed(2));
        const totalAmount = Number((recalculatedSubtotal + shipping + tax).toFixed(2));

        // Create new order
        const order = new Order({
            customerName: customerName,
            email: email,
            cartItems: cartItems,
            totalAmount: totalAmount,
            orderStatus: 'Confirmed',
            createdDate: new Date()
        });

        // Save order to database
        await order.save();

        // Clear cart session
        req.session.cart = [];

        // Return success response with order ID
        res.json({
            success: true,
            orderId: order._id
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
});

module.exports = router;
