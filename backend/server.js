// Import Express framework using CommonJS syntax
const express = require('express');

// Create an Express application instance
const app = express();

// Define the port number the server will listen on
const PORT = 5000;

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

