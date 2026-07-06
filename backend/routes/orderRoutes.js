// backend/routes/orderRoutes.js
import express from 'express';
import { placeOrder, getMyOrders, updateOrderStatus, getDeliveryOrders } from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);            // Checkout Endpoint
router.get('/myorders', protect, getMyOrders);    // History Endpoint
router.get('/delivery', protect, authorizeRoles('deliveryBoy', 'admin', 'owner'), getDeliveryOrders);
router.put('/:id/status', protect, authorizeRoles('deliveryBoy', 'admin', 'owner'), updateOrderStatus); // Delivery Tracking Status

export default router;