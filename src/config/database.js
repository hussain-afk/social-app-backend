import mongoose from "mongoose";
import envConfig from "./env.config.js";

// Global cache object taake serverless environment (Vercel) mein connection barbaar repeat na ho
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // 1. Agar pehle se connection bana hua hai, toh wahi use karo
    if (cached.conn) {
        return cached.conn;
    }

    // 2. Agar connection process mein nahi hai, toh naya connection establish karo
    if (!cached.promise) {
        const opts = {
            dbName: "social_app",
            bufferCommands: false, // 👈 Yeh sabse main line hai jo buffering timeout error ko root se khatam karti hai
            serverSelectionTimeoutMS: 5000, // 5 seconds mein timeout agar network issue ho
        };

        cached.promise = mongoose.connect(envConfig.mongoUri, opts).then((mongooseInstance) => {
            console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // Error aane par cache reset kar do
        console.error(`Error: ${error.message}`);
        throw error;
    }

    return cached.conn;
};

export default connectDB;