const fs = require('fs');
const Papa = require('papaparse');
const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('./models/Employee');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    importCSV();
  })
  .catch(err => console.log(err));

function importCSV() {
  const file = fs.readFileSync('employees.csv', 'utf8');
  const parsed = Papa.parse(file, { header: true });
  const employees = parsed.data.filter(row => row['Employee ID']); // filter out empty rows

  // Map CSV fields to model fields
  const docs = employees.map(row => ({
    employeeId: row['Employee ID'],
    name: row['Employee'],
    startDate: row['Start date'],
    title: row['Title'],
    address: row['Home address - Full address'],
  }));

  Employee.insertMany(docs)
    .then(() => {
      console.log('Employees imported successfully!');
      mongoose.disconnect();
    })
    .catch(err => {
      console.error('Error importing employees:', err);
      mongoose.disconnect();
    });
}