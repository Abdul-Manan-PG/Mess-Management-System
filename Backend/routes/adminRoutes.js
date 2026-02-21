import express from 'express'
import { uploadStudents,addStudent } from '../controllers/adminController.js'
import { upload } from '../middleware/uploadMiddleware.js';
const router=express.Router();

router.post('/upload-students',upload.single('file'),uploadStudents)


router.post('/add-student',addStudent);

export default router;