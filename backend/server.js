// Load environment variables from .env
require('dotenv').config();

// Import Express framework using CommonJS syntax
const express = require('express');
const cors = require('cors');
const paymentRouter = require('./routes/payment');

// Create an Express application instance
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON body parsing middleware
app.use(express.json());

// Register payment router
app.use('/api/payment', paymentRouter);

// Define the port number the server will listen on (dynamically assigned by Render or defaulted to 5000)
const PORT = process.env.PORT || 5000;

// Health-test route: responds to GET /api/test
app.get('/api/test', (req, res) => {
  // Send the required JSON response
  res.json({
    message: 'Backend is working!',
  });
});

// Start the server and log a message when it is running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


