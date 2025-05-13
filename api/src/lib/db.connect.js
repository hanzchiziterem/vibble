import mongoose, { connect } from "mongoose";

export const connectToDatabase = async () => {
  try {
    const conRes = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conRes.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};
