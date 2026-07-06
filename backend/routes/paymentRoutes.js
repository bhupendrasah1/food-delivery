import express from 'express';
import { initiateKhaltiPayment, verifyKhaltiPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate', protect, initiateKhaltiPayment); // Secure initiation
router.get('/khalti-callback', verifyKhaltiPayment);      // Open callback handle

export default router;