const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Please set it in server/.env");
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
