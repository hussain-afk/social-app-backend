import mongoose from "mongoose";
import envConfig from "./env.config.js";

const connectDB = async () => {
    try {
            const connection = await mongoose.connect(envConfig.mongoUri,{
                dbName: "social_app",
            });
            console.log(`MongoDB connected: ${connection.connection.host}`);
        } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

export default connectDB;