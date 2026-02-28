import multer from 'multer';
import path from 'path';

// Change destination to Vercel's writable temporary directory (/tmp/)
const storage = multer.diskStorage({
    destination: '/tmp/', 
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /csv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error("Error: Only CSV files are allowed!"));
    }
});