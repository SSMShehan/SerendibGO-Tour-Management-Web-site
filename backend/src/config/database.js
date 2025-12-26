const mongoose = require('mongoose');

// Cache connection for serverless functions (Vercel)
let cachedConnection = null;

const connectDB = async () => {
  // If we have a cached connection and it's connected, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  // If connection exists but is in a bad state, close it
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Minimum connections for serverless
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Cache the connection
    cachedConnection = conn;

    return conn;
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);

    // Provide helpful debugging information
    if (error.message.includes('bad auth')) {
      console.error('\n💡 Solution: Check your MongoDB username and password in MONGODB_URI');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Possible causes:');
      console.error('   1. IP address not whitelisted in MongoDB Atlas');
      console.error('      → Go to Atlas → Network Access → Add IP Address → Allow 0.0.0.0/0 for testing');
      console.error('   2. Incorrect cluster hostname in connection string');
      console.error('   3. Network/firewall blocking the connection');
    } else if (!process.env.MONGODB_URI) {
      console.error('\n💡 Solution: Set MONGODB_URI in environment variables or .env file');
    }

    console.error('\n📝 Setup Instructions:');
    console.error('   1. Set MONGODB_URI in Vercel environment variables (for production)');
    console.error('   2. Or copy .env.example to .env and configure (for local dev)');
    console.error('   3. Ensure your IP is whitelisted in MongoDB Atlas');

    // Re-throw the error so routes can handle it
    throw error;
  }
};

module.exports = connectDB;
