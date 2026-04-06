import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);
export default router;