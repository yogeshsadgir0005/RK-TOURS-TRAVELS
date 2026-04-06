import express from 'express';
import { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes (for the Homepage)
router.get('/', getAllTestimonials);

// Admin routes
router.post('/', protect, admin, createTestimonial);
router.put('/:id', protect, admin, updateTestimonial);
router.delete('/:id', protect, admin, deleteTestimonial);

export default router;