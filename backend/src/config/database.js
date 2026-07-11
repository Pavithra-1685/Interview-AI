const mongoose = require('mongoose');

async function connectToDB() {
  try{
    await mongoose.connect(process.env.MongoDB_URI);
    console.log('connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectToDB;