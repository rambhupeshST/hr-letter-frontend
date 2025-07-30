const mongoose = require('mongoose');

const letterRequestSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  letterType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  adminNotes: {
    type: String,
    default: ''
  },
  processedDate: {
    type: Date
  }
});

module.exports = mongoose.model('LetterRequest', letterRequestSchema); 