const Razorpay = require('razorpay');

// Ensure required environment variables are loaded
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.error('❌ Razorpay Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in environment variables.');
}

// Initialize the Razorpay instance with credentials
const razorpay = new Razorpay({
  key_id: keyId || 'rzp_test_placeholder_id',
  key_secret: keySecret || 'placeholder_secret',
});

module.exports = razorpay;
