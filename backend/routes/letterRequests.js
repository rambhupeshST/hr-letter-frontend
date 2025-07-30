const express = require('express');
const router = express.Router();
const LetterRequest = require('../models/LetterRequest');

// Submit a new letter request
router.post('/', async (req, res) => {
  try {
    const { employeeId, employeeName, letterType } = req.body;
    const newRequest = new LetterRequest({
      employeeId,
      employeeName,
      letterType
    });
    await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all letter requests (for admin)
router.get('/', async (req, res) => {
  try {
    const requests = await LetterRequest.find().sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get requests by employee ID
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const requests = await LetterRequest.find({ 
      employeeId: req.params.employeeId 
    }).sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update request status (for admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status !== 'pending') updateData.processedDate = new Date();
    
    const updatedRequest = await LetterRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 