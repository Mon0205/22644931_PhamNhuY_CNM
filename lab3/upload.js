// upload.js
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // tối đa 5MB
    }
});

export default upload;
