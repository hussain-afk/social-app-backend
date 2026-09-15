import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
    port: process.env.PORT || 3000,

    mongoUri: process.env.MONGO_URI,

    jwt: process.env.JWT_SECRET,

    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,

    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}

export default envConfig;