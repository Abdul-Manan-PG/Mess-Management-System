import express from 'express'
import { uploadStudents } from '../controllers/adminController.js'
import { upload } from '../middleware/uploadMiddleware.js';
const router=express.Router();

router.post('/upload-students',upload.single('file'),uploadStudents)

export default router;