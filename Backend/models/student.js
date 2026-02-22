import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, default: 'student' }
}, { timestamps: true });

// Check if the model exists before creating a new one
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;