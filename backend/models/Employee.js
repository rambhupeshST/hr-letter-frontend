const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  startDate: String,
  title: String,
  address: String,
});

module.exports = mongoose.model('Employee', employeeSchema); 