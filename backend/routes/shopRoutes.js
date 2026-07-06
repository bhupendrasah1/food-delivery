import express from 'express';
import { getShops, createShop } from '../controllers/shopsController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.post('/add', protect, upload.single('image'), createShop);
router.get('/', getShops);

export default router;