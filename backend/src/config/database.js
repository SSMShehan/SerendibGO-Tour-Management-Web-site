const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Validate MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔄 Attempting to connect to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

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
      console.error('\n💡 Solution: Create a .env file with MONGODB_URI variable');
    }

    console.error('\n📝 Setup Instructions:');
    console.error('   1. Copy .env.example to .env');
    console.error('   2. Replace MONGODB_URI with your actual connection string');
    console.error('   3. Ensure your IP is whitelisted in MongoDB Atlas');

    // In production, exit. In development, allow debugging
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('\n⚠️  Running in development mode without database connection');
      console.warn('⚠️  Some features will not work properly\n');
    }
  }
};

module.exports = connectDB;

