import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'
import managerRoutes from './routes/managerRoutes.js'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'

// Load variables from .env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To read JSON data sent by your friend
app.use(express.urlencoded({ extended: true })); // Essential for Form-encoded data
// Basic Route for testing

app.use('/api/admin', adminRoutes);

app.use('/api/manager',managerRoutes)

app.use('/api/auth',authRoutes)

app.use('/api/student',studentRoutes)
app.get('/', (req, res) => {
    res.send("Hostel Mess API is running! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} ⚡`));