const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { adminOnly } = require('../middleware/auth');

// Apply adminOnly middleware to all admin routes
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

// Show add ticket form
router.get('/tickets/add', (req, res) => {
  res.render('admin-add-ticket', { title: 'Add Ticket', layout: 'admin-layout' });
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

// Show edit ticket form
router.get('/tickets/edit/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
    res.render('admin-edit-ticket', { title: 'Edit Ticket', ticket, layout: 'admin-layout' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// Update ticket
router.post('/tickets/edit/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    await Ticket.findByIdAndUpdate(req.params.id, { name, price, description });
    res.redirect('/admin/tickets');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// Delete ticket
router.post('/tickets/delete/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.redirect('/admin/tickets');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
