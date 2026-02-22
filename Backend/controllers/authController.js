import Student from '../models/student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const studentLogin = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // 1. Check if user exists (using the Student model which now contains staff)
    const user = await Student.findOne({ rollNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user)
   let isMatch = false;

if (user.role === 'admin' || user.role === 'manager') {
  // Staff logic: Simple plain-text comparison
  isMatch = (password === user.password);
} else {
  // Student logic: Secure bcrypt comparison
  isMatch = await bcrypt.compare(password, user.password);
}
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Sign the Token (Include the role in the token for security)
    const token = jwt.sign(
      { id: user._id, rollNumber: user.rollNumber, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Send back to Frontend (IMPORTANT: Added 'role' here)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        rollNumber: user.rollNumber,
        role: user.role // Frontend needs this to decide which dashboard to show
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};