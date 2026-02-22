import express from 'express';
import { getMealStatus, updateMealStatus } from '../controllers/mealController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes are protected by JWT
router.get('/meal-status', protect, getMealStatus);
router.post('/update-meal-status', protect, updateMealStatus);

export default router;