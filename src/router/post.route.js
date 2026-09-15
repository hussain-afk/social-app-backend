import express from "express";
import { createPost, getAllPosts, addComment, getAllUserPosts } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/create", authMiddleware, upload.single('content'), createPost);
router.patch("/comment/:postId", authMiddleware, addComment);
router.get("/all", authMiddleware, getAllPosts);
router.get("/user", authMiddleware, getAllUserPosts); // User ke posts ko fetch karne ke liye


export default router;