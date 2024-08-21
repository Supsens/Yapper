import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Problem in connecting to the database:", error.message);
    }
};
