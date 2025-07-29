const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ram', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const results = [];

fs.createReadStream('employees.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Convert date format from DD-MM-YYYY to ISO format
    const [day, month, year] = data['Start date'].split('-');
    data['Start date'] = new Date(`${year}-${month}-${day}`);
    results.push(data);
  })
  .on('end', async () => {
    const db = mongoose.connection.db;
    
    // Drop existing collection
    await db.collection('employees').drop().catch(() => {});
    
    // Insert new data
    await db.collection('employees').insertMany(results);
    
    console.log(`Successfully imported ${results.length} employees`);
    mongoose.connection.close();
  });