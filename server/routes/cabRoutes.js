import express from 'express';
import { createCab, getAllCabs, getCabById, updateCab, deleteCab } from '../controllers/cabController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllCabs);
router.get('/:id', getCabById);

// Admin Routes
router.post('/', protect, admin, createCab);
router.put('/:id', protect, admin, updateCab);
router.delete('/:id', protect, admin, deleteCab);

export default router;