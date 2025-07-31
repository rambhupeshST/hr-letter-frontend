const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration: allow frontend origin from environment variable or default localhost:5173
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB with async/await and proper error handling
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Note: useCreateIndex and useFindAndModify are deprecated in recent mongoose versions
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the app if DB connection fails
  }
}
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Import route handlers
const employeeRoutes = require('./routes/employees');
const letterRequestRoutes = require('./routes/letterRequests');

// Use API routes with base paths
app.use('/api/employees', employeeRoutes);
app.use('/api/letter-requests', letterRequestRoutes);

// Optional global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (closeErr) {
    console.error('Error during MongoDB connection close:', closeErr);
  }
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
