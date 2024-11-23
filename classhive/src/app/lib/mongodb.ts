import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        const mongoDBUrl = process.env.MONGODB_URL;
        if (!mongoDBUrl) {
            throw new Error("MONGODB_URL is not defined in the environment variables");
        }

        await mongoose.connect(mongoDBUrl);
        console.log("Connected to MONGODB");
    } catch (error) {
        console.error("Error Connecting to MONGODB:", error);
    }
};
