import Student from '../models/student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const studentLogin = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // 1. Check if student exists
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Compare Password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Sign the Token
    // We put the student ID and Roll Number inside the token
    const token = jwt.sign(
      { id: student._id, rollNumber: student.rollNumber },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token lasts 1 day
    );

    // 4. Send back to Frontend
    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        name: student.name,
        rollNumber: student.rollNumber
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};