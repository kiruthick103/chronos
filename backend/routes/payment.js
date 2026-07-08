const express = require('express');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');

const router = express.Router();

/**
 * @route   POST /api/payment/create-order
 * @desc    Create a new Razorpay order
 * @access  Public
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Razorpay expects the amount in the smallest currency unit (e.g. Paise for INR, Cents for USD)
    // We convert the amount (e.g., 500) to the smallest unit (500 * 100 = 50000)
    const options = {
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log(`[Razorpay] Creating order:`, options);
    const order = await razorpay.orders.create(options);

    // Return order_id, amount, currency, and key_id to the frontend as required
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message || error
    });
  }
});

/**
 * @route   POST /api/payment/verify
 * @desc    Verify Razorpay payment signature
 * @access  Public
 */
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification details' });
    }

    // Create HMAC signature using our Key Secret
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    console.log(`[Razorpay] Verifying signature. Expected: ${expectedSignature}, Received: ${razorpay_signature}`);

    if (razorpay_signature === expectedSignature) {
      return res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature verification failed'
      });
    }
  } catch (error) {
    console.error('❌ Error verifying Razorpay signature:', error);
    res.status(500).json({
      error: 'Verification server error',
      details: error.message || error
    });
  }
});

module.exports = router;
