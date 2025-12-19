const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST route to create order
router.post('/create-order', async (req, res) => {
    try {
        const { customerName, email } = req.body;

        if (!customerName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Customer name and email are required'
            });
        }

        // Calculate totals from cart
        const cartItems = req.session.cart;
        const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
        const shipping = 9.99;
        const tax = subtotal * 0.10;
        const totalAmount = subtotal + shipping + tax;

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
