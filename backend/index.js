// index.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for your frontend (change origin as needed)
app.use(cors({ origin: 'http://localhost:5173' }));

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('MongoDB connected successfully');
});

// Health check route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Import and use your route files
const employeeRoutes = require('./routes/employees');
const letterRoutes = require('./routes/letterRequests');

app.use('/api/employees', employeeRoutes);
app.use('/api/letter-requests', letterRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
