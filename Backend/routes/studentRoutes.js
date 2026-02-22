import express from 'express';
import { getMealStatus, updateMealStatus, getMealTimings } from '../controllers/mealController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly available (or you can add 'protect' if you want only logged-in users to see timings)
router.get('/meal-timings', getMealTimings);

// Protected routes (Needs the JWT token)
router.get('/meal-status', protect, getMealStatus); 
router.post('/update-meal-status', protect, updateMealStatus);

export default router;