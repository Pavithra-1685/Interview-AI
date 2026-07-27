const mongoose = require('mongoose');

async function connectToDB() {
  try{
    const uri = process.env.MONGODB_URI || process.env.MongoDB_URI;
    if (!uri) {
      throw new Error("MongoDB connection string (MONGODB_URI) is missing in environment variables.");
    }
    await mongoose.connect(uri);
    console.log('connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectToDB;