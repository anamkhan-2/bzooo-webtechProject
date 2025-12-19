const express = require('express');
const router = express.Router();
const Ticket = require('../../models/Ticket');
const Order = require('../../models/Order');
const { adminOnly } = require('../middleware/auth');

// Login form
router.get('/login', (req, res) => {
  res.render('lab-final/admin-login', { error: null, redirect: req.query.redirect || '/admin' });
});

// Login submit
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (email === 'admin@shop.com') {
    req.session.user = { email };
    return res.redirect(req.body.redirect || '/admin');
  }
  res.render('lab-final/admin-login', { error: 'Invalid admin credentials', redirect: req.body.redirect || '/admin' });
});

// Protect all following routes
router.use(adminOnly);

// Admin dashboard
router.get('/', (req, res) => {
  res.render('admin-dashboard', { title: 'Admin Dashboard', layout: 'admin-layout' });
});

// List all tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.render('admin-tickets', { title: 'Manage Tickets', tickets, layout: 'admin-layout' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// Create new ticket
router.post('/tickets', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newTicket = new Ticket({ name, price, description });
    await newTicket.save();
    res.redirect('/admin/tickets');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// List all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.render('admin-orders', { title: 'Manage Orders', orders, layout: 'admin-layout' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// Confirm order
router.post('/orders/:id/confirm', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { orderStatus: 'Confirmed' });
    res.redirect('/admin/orders');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// Cancel order
router.post('/orders/:id/cancel', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { orderStatus: 'Cancelled' });
    res.redirect('/admin/orders');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
