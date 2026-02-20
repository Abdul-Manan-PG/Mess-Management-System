import Student from '../models/Student.js';
import csv from 'csvtojson';
import bcrypt from 'bcryptjs';

export const uploadStudents = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Please upload a CSV file" });

        const jsonArray = await csv().fromFile(req.file.path);
        
        const preparedStudents = [];
        const responseData = [];

        for (const item of jsonArray) {
            // 1. Skip dummy rows
            if (item["Roll no"] === "0" || !item["Roll no"]) continue;

            // 2. Fix Mapping: Use item.NAME (matching your CSV headers)
            const name = item.NAME; 
            const rollNumber = item["Roll no"]; 

            const email = `${rollNumber.toLowerCase()}@ksk.uet.edu.pk`;
            email.replaceAll('-','');
            const randomPassword = "uet" + Math.floor(1000 + Math.random() * 9000);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            preparedStudents.push({
                name: name || "Unknown", // Fallback if name is empty
                rollNumber,
                email,
                password: hashedPassword
            });

            responseData.push({ name, rollNumber, email, randomPassword });
        }

        // 3. FIX: Changed 'studentsToInsert' to 'preparedStudents'
        // ordered: false allows skipping duplicates if you upload the same file twice
        await Student.insertMany(preparedStudents, { ordered: false });

        res.status(201).json({ 
            message: "Students uploaded successfully!",
            count: preparedStudents.length,
            students: responseData
        });

    } catch (error) {
        // If it's a duplicate error (code 11000), we still want to tell the user
        if (error.code === 11000) {
            return res.status(201).json({ message: "Upload done (some duplicates were skipped)" });
        }
        res.status(500).json({ message: error.message });
    }
};