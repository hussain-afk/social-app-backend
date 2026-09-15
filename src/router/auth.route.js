import express from 'express';
import {registerUser, loginUser, getCurrentUser, updateProfile} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

const cpUpload = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 }
]);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware , getCurrentUser);
router.patch("/updateProfile", authMiddleware, cpUpload, updateProfile);

export default router;