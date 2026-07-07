import express from 'express';
import passport from 'passport'; 
import '../config/env.js';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword,
  handleGoogleCallback 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser); // 
router.get('/me', protect, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    return res.status(200).json({ message: "Logged out successfully" });
});

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed` }),
  handleGoogleCallback
);

export default router;