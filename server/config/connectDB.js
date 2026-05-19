// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in the .env file");
}

async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "imagify" // 👈 force mongoose to use "imagify"
    });
    console.log("✅ MongoDB connected with Mongoose");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
}

export default connectDB;
