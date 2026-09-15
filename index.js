import express from 'express';
import envConfig from './src/config/env.config.js';
import connectDB from './src/config/database.js';
import authRoutes from './src/router/auth.route.js';
import postRoutes from './src/router/post.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

connectDB();

app.use(cors({
    origin: envConfig.frontendUrl, // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(envConfig.port, () => {
    console.log(`Server is running on port ${envConfig.port}`);
});

