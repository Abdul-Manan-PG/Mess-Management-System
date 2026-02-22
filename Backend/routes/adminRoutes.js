import express from 'express'
import { uploadStudents,addStudent } from '../controllers/adminController.js'
import { upload } from '../middleware/uploadMiddleware.js';
import {updateMealTimings} from '../controllers/mealController.js'
const router=express.Router();

router.post('/upload-students',upload.single('file'),uploadStudents)

router.post('/update-timings', updateMealTimings);
router.post('/add-student',addStudent);

export default router;