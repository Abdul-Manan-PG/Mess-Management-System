import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // This will be the hashed random password
    role: { type: String, default: 'student' }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);