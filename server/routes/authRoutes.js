import express from 'express';
import { 
  registerUser, 
  verifyOTP, 
  loginUser, 
  googleLogin, 
  getMe, 
  forgotPassword, 
  resetPassword,
  verifyAndCommitUpdate,
  requestProfileUpdateOTP 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

// Added Reset Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Add these routes
router.post('/request-update-otp', protect, requestProfileUpdateOTP);
router.post('/verify-update', protect, verifyAndCommitUpdate);
export default router;