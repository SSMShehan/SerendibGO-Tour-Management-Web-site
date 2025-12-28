const mongoose = require('mongoose');

// Cache connection for serverless functions (Vercel)
let cachedConnection = null;

const connectDB = async () => {
  // #region agent log
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:6',message:'connectDB called',data:{readyState:mongoose.connection.readyState,hasCached:cachedConnection!==null,hasEnvVar:!!process.env.MONGODB_URI,envVarLength:process.env.MONGODB_URI?.length||0,nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
  }
  // #endregion
  // If we have a cached connection and it's connected, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:9',message:'Using cached connection',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    }
    // #endregion
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  // If connection exists but is in a bad state, close it
  if (mongoose.connection.readyState !== 0) {
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:15',message:'Closing bad connection state',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
    // #endregion
    await mongoose.connection.close();
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📋 Connection details:');
    console.log('   - URI length:', process.env.MONGODB_URI?.length || 0);
    console.log('   - URI starts with:', process.env.MONGODB_URI?.substring(0, 30) || 'none');
    console.log('   - Server selection timeout:', 10000, 'ms');
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:21',message:'Before connection check',data:{hasMongoUri:!!process.env.MONGODB_URI,mongoUriPrefix:process.env.MONGODB_URI?.substring(0,20)||'none',mongoUriLength:process.env.MONGODB_URI?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
    }
    // #endregion

    if (!process.env.MONGODB_URI) {
      // #region agent log
      if (typeof fetch !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:22',message:'MONGODB_URI not set error',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
      // #endregion
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // #region agent log
    const connectStartTime = Date.now();
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:25',message:'Starting mongoose.connect',data:{connectStartTime},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D,E'})}).catch(()=>{});
    }
    // #endregion
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
    // #region agent log
    const connectEndTime = Date.now();
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:35',message:'mongoose.connect succeeded',data:{connectDuration:connectEndTime-connectStartTime,host:conn.connection.host,dbName:conn.connection.name,readyState:conn.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D,E'})}).catch(()=>{});
    }
    // #endregion

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Cache the connection
    cachedConnection = conn;

    return conn;
  } catch (error) {
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'database.js:43',message:'Connection error caught',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack?.substring(0,200),hasBadAuth:error.message.includes('bad auth'),hasTimeout:error.message.includes('ETIMEDOUT')||error.message.includes('ENOTFOUND'),hasNetworkError:error.message.includes('network')||error.message.includes('ENOTFOUND')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
    }
    // #endregion
    console.error('❌ Database connection failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.stack) {
      console.error('Error stack (first 500 chars):', error.stack.substring(0, 500));
    }

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
