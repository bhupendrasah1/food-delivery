import axios from 'axios';
import { pool } from '../config/db.js';
import { getIO } from '../config/socket.js';

const isValidKhaltiSecret = (value) => {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed && !trimmed.includes('Your_Khalti_Secret_Key_Here');
};

const getKhaltiSecretKey = () => {
  const candidates = [process.env.khalti_secret_key, process.env.KHALTI_SECRET_KEY];
  return candidates.find(isValidKhaltiSecret) || '';
};
const getBackendUrl = () => process.env.BACKEND_URL || 'http://localhost:5000';
const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// @desc    Initiate Khalti Payment Gateway
// @route   POST /api/payment/initiate
// @access  Private
export const initiateKhaltiPayment = async (req, res) => {
  const { order_id } = req.body;
  const khaltiSecretKey = getKhaltiSecretKey();

  try {
    if (!isValidKhaltiSecret(khaltiSecretKey)) {
      return res.status(500).json({
        message: 'Khalti secret key is missing or not configured correctly on the server.',
      });
    }

    // 1. Fetch order details from database to ensure accuracy
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.payment_method !== 'khalti') {
      return res.status(400).json({ message: 'This order is not configured for Khalti payment.' });
    }

    
    const amountInPaisa = Math.round(parseFloat(order.total_amount) * 100);

    // 2. Prepare payload for Khalti Server
    const khaltiPayload = {
      return_url: `${getBackendUrl()}/api/payment/khalti-callback`,
      website_url: getFrontendUrl(),
      amount: amountInPaisa,
      purchase_order_id: order.id.toString(),
      purchase_order_name: `Food Order #${order.id}`,
      customer_info: {
        name: req.user?.name || 'Customer',
        email: req.user?.email || 'customer@example.com',
      }
    };

    // 3. Hit Khalti API
    const khaltiResponse = await axios.post(
      'https://a.khalti.com/api/v2/epayment/initiate/',
      khaltiPayload,
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 4. Return payment URL back to the frontend
    res.json({
      message: 'Payment initiated!',
      payment_url: khaltiResponse.data.payment_url,
      pidx: khaltiResponse.data.pidx,
    });

  } catch (error) {
    const khaltiError = error.response?.data;
    const statusCode = error.response?.status || 500;
    console.error('Khalti Error:', khaltiError || error.message);

    return res.status(statusCode).json({
      message: 'Failed to initiate payment with Khalti',
      detail: khaltiError || error.message,
    });
  }
};

// @desc    Khalti Callback URL to verify status
// @route   GET /api/payment/khalti-callback
// @access  Public (Called automatically by Khalti redirection)
export const verifyKhaltiPayment = async (req, res) => {
  // Khalti appends these query queries automatically into the return_url
  const { pidx, purchase_order_id, status } = req.query;
  const khaltiSecretKey = getKhaltiSecretKey();

  try {
    if (!isValidKhaltiSecret(khaltiSecretKey)) {
      return res.redirect(`${getFrontendUrl()}/payment-failed?reason=server-misconfigured`);
    }

    if (status !== 'Completed') {
      return res.redirect(`${getFrontendUrl()}/payment-failed?reason=canceled`);
    }

    // Server-to-server verification with Khalti to double check everything
    const verificationResponse = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // If Khalti confirms payment is successful
    if (verificationResponse.data.status === 'Completed') {
      
      // Update payment status in our PostgreSQL Database
      const updatedOrderResult = await pool.query(
        `UPDATE orders 
         SET payment_status = 'Paid', payment_id = $1, status = 'Preparing' 
         WHERE id = $2
         RETURNING *`,
        [pidx, purchase_order_id]
      );

      getIO()?.emit('orders:changed', {
        type: 'paid',
        orderId: Number(purchase_order_id),
        status: 'Preparing',
        paymentStatus: 'Paid',
        order: updatedOrderResult.rows[0],
      });

      // Redirect the user back to the frontend's success screen!
      return res.redirect(`${getFrontendUrl()}/payment-success?orderId=${purchase_order_id}`);
    } else {
      return res.redirect(`${getFrontendUrl()}/payment-failed`);
    }

  } catch (error) {
    console.error('Verification Error:', error.response?.data || error.message);
    return res.redirect(`${getFrontendUrl()}/payment-failed?reason=server-error`);
  }
};