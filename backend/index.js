const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
// Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Route imports
const employeeRoutes = require('./routes/employees');
const letterRoutes = require('./routes/letterRequests');
app.use('/api/employees', employeeRoutes);
app.use('/api/letter-requests', letterRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));