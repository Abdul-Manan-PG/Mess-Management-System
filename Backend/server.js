// Remove all the commented-out old code at the top to keep it clean

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'
import managerRoutes from './routes/managerRoutes.js'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 1. Create HTTP Server and Socket.io instance
const httpServer = createServer(app); 

// 2. Setup Socket.io CORS for Live Deployment
const io = new Server(httpServer, {
    cors: {
        // This will use your Vercel URL in production, but fall back to localhost for local testing
        origin: process.env.FRONTEND_URL || "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});

// 3. Share 'io' with your routes/controllers
app.set('socketio', io);

// 4. Setup Express CORS for Live Deployment
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

app.get('/', (req, res) => {
    res.send("Hostel Mess API is running! 🚀");
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('User connected to live updates:', socket.id);
    socket.on('disconnect', () => console.log('User disconnected'));
});

// IMPORTANT: Listen on httpServer, not app
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT} ⚡`));