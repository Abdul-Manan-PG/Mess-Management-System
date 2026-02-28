import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Setup Express CORS for Live Deployment
app.use(cors({
    origin: process.env.FRONTEND_URL || "*" // Allow your frontend URL
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send("Hostel Mess API is running on Vercel! 🚀");
});

// Local Development Server (Runs only if not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Local server started on port ${PORT} ⚡`));
}

// IMPORTANT FOR VERCEL: Export the app!
export default app;