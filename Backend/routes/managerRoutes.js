// Add this to your existing adminRoutes.js
import express from 'express'
import { updateWeeklyMenu,getWeeklyMenu } from '../controllers/managerController.js';


const router=express.Router();

router.post('/update-menu', updateWeeklyMenu);

router.get('/get-menu', getWeeklyMenu);

export default router;