/**
 * Database Connection Module
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Connects to MongoDB Atlas or Local MongoDB using Mongoose with resilient connection pooling.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // Exit process with failure code 1 in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
