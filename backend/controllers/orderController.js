import { pool } from '../config/db.js';
import { getIO } from '../config/socket.js';

// @desc    Place a new food order
// @route   POST /api/orders
// @access  Private (Customers only)
export const placeOrder = async (req, res) => {
  const { items, total_amount, delivery_address, latitude, longitude, payment_method = 'cod' } = req.body;
  const user_id = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty! 🛒' });
  }

  // 1. Start a SQL Transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN'); // Start transaction secure window

    // 2. Insert into the main 'orders' table
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, delivery_address, latitude, longitude, payment_method) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, total_amount, delivery_address, latitude, longitude, payment_method]
    );
    
    const newOrder = orderResult.rows[0];

    // 3. Loop through all items from frontend cart and insert into 'order_items'
    for (let product of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [newOrder.id, product.item_id, product.quantity, product.price]
      );
    }

    await client.query('COMMIT'); // Commit all inserts safely at once

    getIO()?.emit('orders:changed', {
      type: 'created',
      orderId: newOrder.id,
      paymentMethod: payment_method,
      paymentStatus: newOrder.payment_status,
      status: newOrder.status,
    });
    
    res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Cancel everything if a crash happens
    console.error(error);
    res.status(500).json({ message: 'Transaction failed, order cancelled' });
  } finally {
    client.release(); // Free up the connection channel back to the pool
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
       json_agg(json_build_object('item_id', oi.item_id, 'quantity', oi.quantity, 'price', oi.price, 'name', a.name)) as order_details
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN ad_foods a ON oi.item_id = a.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching order history' });
  }
};

// @desc    Get orders for delivery boy dashboard
// @route   GET /api/orders/delivery
// @access  Private (Delivery boys)
export const getDeliveryOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.status,
         o.total_amount AS amount,
         CASE
           WHEN o.payment_status = 'Paid' THEN 'Online Paid'
           ELSE 'Cash on Delivery'
         END AS payment,
         o.delivery_address AS address,
         o.latitude,
         o.longitude,
         u.name AS customer_name,
         u.mobile AS phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.status IN ('Pending', 'Preparing', 'Picked Up', 'Out for Delivery')
         AND (o.payment_method = 'cod' OR o.payment_status = 'Paid')
       ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching delivery orders' });
  }
};

// @desc    Update Order Status (For Restaurants/Drivers)
// @route   PUT /api/orders/:id/status
// @access  Private (Owners/Admins/Drivers)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Preparing', 'Out for Delivery', 'Delivered'

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    getIO()?.emit('orders:changed', {
      type: 'status-updated',
      orderId: Number(id),
      status,
    });

    res.json({ message: 'Order status updated!', order: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};