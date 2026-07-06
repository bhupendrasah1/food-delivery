import express from 'express';
import { addFoodItem, getMenuByShop } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addFoodItem);       // Protected (Only the shop owner)
router.get('/shop/:shopId', getMenuByShop);   // Public (Everyone can view menus)

export default router;