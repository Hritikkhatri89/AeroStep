const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Configure Google Public DNS for SRV record resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore DNS set error if restricted
}

const connectDB = async () => {
  // Reuse existing connection if available (for serverless environments)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const rawUri = process.env.MONGO_URI || '';
    const mongoUri = rawUri.trim().replace(/^['"]|['"]$/g, '');
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
