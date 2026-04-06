import express from 'express';
import { createRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute } from '../controllers/routeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllRoutes);
router.get('/:id', getRouteById);

// Admin Routes
router.post('/', protect, admin, createRoute);
router.put('/:id', protect, admin, updateRoute);
router.delete('/:id', protect, admin, deleteRoute);

export default router;