const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Apply for Leave
router.post('/apply', async (req, res) => {
  try {
    const { userId, userName, reason, startDate, endDate } = req.body;
    const newLeave = new Leave({ userId, userName, reason, startDate, endDate });
    await newLeave.save();
    res.status(201).json({ message: 'Leave application submitted successfully', leave: newLeave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all leaves
router.get('/all', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;