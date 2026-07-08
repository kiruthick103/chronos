/**
 * Service to manage Razorpay payments on the frontend.
 * Handles script injection, order creation, checkout overlay display,
 * and server-side cryptographic signature verification.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Dynamically loads the Razorpay checkout script if not already loaded.
 * @returns {Promise<boolean>} Resolves to true when the script loads successfully.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If Razorpay is already available globally, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Calls backend to create a Razorpay order.
 * @param {number} amount - The amount to charge (in main currency unit, e.g. 500)
 * @param {string} currency - Currency code (e.g. "INR" or "USD")
 * @returns {Promise<object>} Resolves with the Razorpay order details.
 */
export const createRazorpayOrder = async (amount, currency = 'INR') => {
  try {
    const response = await fetch(`${API_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order on server');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error);
    throw error;
  }
};

/**
 * Calls backend to verify the cryptographic signature of a Razorpay payment.
 * @param {object} paymentDetails - Verification details from Razorpay
 * @param {string} paymentDetails.razorpay_order_id
 * @param {string} paymentDetails.razorpay_payment_id
 * @param {string} paymentDetails.razorpay_signature
 * @returns {Promise<object>} Verification response from server.
 */
export const verifyRazorpayPayment = async (paymentDetails) => {
  try {
    const response = await fetch(`${API_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Signature verification failed');
    }

    return data;
  } catch (error) {
    console.error('❌ Razorpay payment verification failed:', error);
    throw error;
  }
};

/**
 * Initiates checkout via Razorpay overlay.
 * @param {object} params
 * @param {number} params.amount - Amount in standard currency units (e.g. 10000)
 * @param {string} [params.currency='INR'] - Currency code
 * @param {object} params.customerInfo - Contact info for pre-filling checkout
 * @param {string} params.customerInfo.email
 * @param {string} params.customerInfo.firstName
 * @param {string} [params.customerInfo.lastName='']
 * @param {string} [params.customerInfo.phone='9999999999']
 * @param {function} params.onSuccess - Callback on verified payment success
 * @param {function} params.onFailure - Callback on payment failure or mismatch
 */
export const executeRazorpayPayment = async ({
  amount,
  currency = 'INR',
  customerInfo,
  onSuccess,
  onFailure,
}) => {
  try {
    // 1. Dynamically load the script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    // 2. Create Razorpay order on our Node.js backend
    const orderData = await createRazorpayOrder(amount, currency);
    const { order_id, amount: orderAmount, currency: orderCurrency, key_id } = orderData;

    // 3. Open Razorpay Checkout modal
    const options = {
      key: key_id, // Key ID retrieved dynamically from backend
      amount: orderAmount, // Amount in paise/cents
      currency: orderCurrency,
      name: 'Chronolux Luxury',
      description: 'Purchase of luxury timepieces',
      image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=200&auto=format&fit=crop', // A nice watch image placeholder
      order_id: order_id,
      prefill: {
        name: `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim(),
        email: customerInfo.email,
        contact: customerInfo.phone || '9999999999',
      },
      theme: {
        color: '#C9A84C', // Matching Chronolux theme color (gold)
      },
      handler: async (response) => {
        // Handler called after client-side authorization succeeded
        try {
          console.log('[Razorpay] Authorization succeeded, verifying payment with backend...');
          
          const verificationDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Cryptographically verify signature on the server
          const verificationResult = await verifyRazorpayPayment(verificationDetails);

          if (verificationResult.success) {
            console.log('✅ Payment verified successfully!');
            onSuccess({
              orderId: order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
          } else {
            throw new Error('Server-side verification returned failure.');
          }
        } catch (err) {
          console.error('❌ Verification failed:', err);
          onFailure(err.message || 'Payment verification failed.');
        }
      },
      modal: {
        ondismiss: () => {
          console.log('[Razorpay] Checkout modal dismissed by user.');
          onFailure('Payment checkout cancelled.');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('❌ Razorpay transaction failed:', response.error);
      onFailure(response.error.description || 'Transaction failed.');
    });

    rzp.open();
  } catch (error) {
    console.error('❌ Razorpay process error:', error);
    onFailure(error.message || 'Could not initiate Razorpay payment.');
  }
};
