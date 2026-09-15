import express from 'express';
import envConfig from './src/config/env.config.js';
import connectDB from './src/config/database.js';
import authRoutes from './src/router/auth.route.js';
import postRoutes from './src/router/post.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// 1. Global Middleware: Har request se pehle database connection ensure karein
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection middleware error:", error);
        return res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

app.use(cors({
    origin: envConfig.frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: "Connect S Backend is running successfully!" });
});

// Local development ke liye app.listen (Vercel khud apne serverless handler se isay run kar leta hai)
if (process.env.NODE_ENV !== 'production') {
    app.listen(envConfig.port, () => {
        console.log(`Server is running on port ${envConfig.port}`);
    });
}

export default app; // 👈 Vercel ke serverless functions ke liye export default zaroori hai