import mongoose from 'mongoose';

const studentRecordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    email: { type: String, required: true },
    plainPassword: { type: String, required: true }, // Not hashed
}, { timestamps: true });

export default mongoose.model('StudentRecord', studentRecordSchema);