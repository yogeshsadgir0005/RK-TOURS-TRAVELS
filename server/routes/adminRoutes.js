import express from 'express';
import { getDashboardStats, getAllBookings } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/bookings', protect, admin, getAllBookings);
export default router;