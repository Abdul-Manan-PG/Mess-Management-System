// import mongoose from 'mongoose';

// const attendanceSchema = new mongoose.Schema({
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//     date: { type: String, required: true }, // Format: "YYYY-MM-DD"
//     mealType: { type: String, enum: ['lunch', 'dinner'], required: true },
//     status: { type: Boolean, default: null }, // true = Accepted, false = Rejected
// }, { timestamps: true });

// // Ensure a student can't have duplicate entries for the same meal on the same day
// attendanceSchema.index({ studentId: 1, date: 1, mealType: 1 }, { unique: true });

// const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
// export default Attendance;
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    }, // Format: "YYYY-MM-DD"
    mealType: { 
        type: String, 
        enum: ['lunch', 'dinner'], 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: null 
    }, // true = Accepted, false = Rejected
}, { timestamps: true });

// This prevents duplicate entries for the same student on the same meal/date
attendanceSchema.index({ studentId: 1, date: 1, mealType: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;