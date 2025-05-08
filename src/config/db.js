const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    if (!process.env.DB_URI) {
      throw new Error('DB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Connected to MongoDB Atlas");    
    return mongoose.connection;
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // Re-throw the error to handle it in app.js
  }
};

module.exports = connectToDb;
