// Load environment variables first
require('dotenv').config();

// Set NODE_ENV default
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Debug environment variables
console.log('🔧 Environment Configuration:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', process.env.PORT || 5000);
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('   STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ SET' : '❌ NOT SET');

// Set fallback values for production if not defined
if (!process.env.MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI is not set!');
  console.error('📝 Please set MONGODB_URI in Vercel environment variables');
  console.error('   Go to: Vercel Dashboard → Settings → Environment Variables\n');
}

// Set fallback for other critical environment variables
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
}
if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '30d';
}
if (!process.env.JWT_COOKIE_EXPIRE) {
  process.env.JWT_COOKIE_EXPIRE = '30';
}
if (!process.env.STRIPE_SECRET_KEY) {
  process.env.STRIPE_SECRET_KEY = 'sk_test_51SIRHEGhGMqfYoq5KBkzdOMEIupPxFUYdR6rbPiHM7s3IohZfLxZD7iwyu489t7OEkTRAv7v06Fjd3y8zEyBGZy500bL41wQoy';
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_1234567890abcdef';
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const tourRoutes = require('./src/routes/tours');
const bookingRoutes = require('./src/routes/bookings');
const paymentRoutes = require('./src/routes/payments');
const reviewRoutes = require('./src/routes/reviews');
const adminRoutes = require('./src/routes/admin');
const guideRoutes = require('./src/routes/guides');
const earningsRoutes = require('./src/routes/earnings');

// Staff routes
const staffRoutes = require('./src/routes/staff');

// Hotel routes
const hotelRoutes = require('./src/routes/hotels/hotels');
const roomRoutes = require('./src/routes/hotels/rooms');
const hotelBookingRoutes = require('./src/routes/hotels/hotelBookingRoutes');
const roomAvailabilityRoutes = require('./src/routes/hotels/roomAvailabilityRoutes');
const hotelReviewRoutes = require('./src/routes/hotels/hotelReviewRoutes');

// Custom trip routes
const customTripRoutes = require('./src/routes/customTrips');

// Notification routes
const notificationRoutes = require('./src/routes/notifications');

// Vehicle routes
const vehicleRoutes = require('./src/routes/vehicles');
const vehicleBookingRoutes = require('./src/routes/vehicles/vehicleBookings');
const vehicleAvailabilityRoutes = require('./src/routes/vehicles/availability');
const vehiclePricingRoutes = require('./src/routes/vehicles/pricing');
const vehicleIntegrationRoutes = require('./src/routes/vehicles/integrations');
const vehicleBookingRequestRoutes = require('./src/routes/vehicles/bookingRequests');
const tripRoutes = require('./src/routes/vehicles/trips');
const driverRoutes = require('./src/routes/vehicles/drivers');
const maintenanceRoutes = require('./src/routes/vehicles/maintenance');
const revenueRoutes = require('./src/routes/vehicles/revenue');

// Import middleware
const { errorHandler } = require('./src/middleware/errorHandler');

// Import database connection
const connectDB = require('./src/config/database');

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting (more lenient for development)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and in development
    return req.path === '/api/health' || process.env.NODE_ENV === 'development';
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    // In production, allow all origins (or you can specify your Vercel domain)
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }

    // In development, only allow localhost
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Initialize database connection
let dbInitialized = false;
let dbInitPromise = null;

const initDB = async () => {
  // #region agent log
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:278',message:'initDB called',data:{dbInitialized,isMainModule:require.main===module,nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
  }
  // #endregion
  if (!dbInitialized) {
    try {
      // #region agent log
      const initStartTime = Date.now();
      if (typeof fetch !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:281',message:'Calling connectDB in initDB',data:{initStartTime},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
      }
      // #endregion
      await connectDB();
      // #region agent log
      const initEndTime = Date.now();
      if (typeof fetch !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:282',message:'connectDB completed in initDB',data:{initDuration:initEndTime-initStartTime,readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
      }
      // #endregion
      dbInitialized = true;
      console.log('✅ Database initialized for serverless');
    } catch (err) {
      // #region agent log
      if (typeof fetch !== 'undefined') {
        fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:285',message:'initDB error',data:{errorMessage:err.message,errorName:err.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
      }
      // #endregion
      console.error('❌ Failed to initialize database:', err.message);
      console.error('Error stack:', err.stack);
      dbInitialized = false;
      // Don't throw - let the app continue even if DB init fails
    }
  }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:middleware',message:'Request middleware - checking DB',data:{path:req.path,method:req.method,dbInitialized,readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
    }
    // #endregion
    // Skip health check endpoints
    if (req.path === '/api/health' || req.path === '/api/debug-connection') {
      return next();
    }
    
    // If DB not initialized, wait for it
    if (!dbInitialized && mongoose.connection.readyState !== 1) {
      if (!dbInitPromise) {
        dbInitPromise = initDB();
      }
      try {
        await dbInitPromise;
      } catch (err) {
        console.error('❌ Database initialization failed in middleware:', err.message);
        // #region agent log
        if (typeof fetch !== 'undefined') {
          fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:middleware-error',message:'DB init failed in middleware',data:{errorMessage:err.message,readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
        }
        // #endregion
        // Don't block the request, but log the error
      }
    }
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:middleware-end',message:'Request middleware - after DB check',data:{readyState:mongoose.connection.readyState,dbInitialized},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
    }
    // #endregion
    next();
  } catch (err) {
    console.error('❌ Middleware error:', err.message);
    // Still call next to avoid blocking
    next();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SerendibGo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/debug-connection', (req, res) => {
  res.status(200).json({
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    readyStateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    database: mongoose.connection.name || 'Not connected',
    host: mongoose.connection.host || 'Not connected',
    mongoUri: process.env.MONGODB_URI ? '✅ Set' : '❌ Not set',
    env: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/earnings', earningsRoutes);

// Staff API routes
app.use('/api/staff', staffRoutes);

// Hotel API routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/hotels', roomRoutes); // Mount room routes under /api/hotels
app.use('/api', roomAvailabilityRoutes); // Mount room availability routes under /api
app.use('/api/hotel-bookings', hotelBookingRoutes); // Mount hotel booking routes under /api/hotel-bookings
app.use('/api/hotel-reviews', hotelReviewRoutes); // Mount hotel review routes under /api/hotel-reviews

// Vehicle API routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles', vehicleAvailabilityRoutes);
app.use('/api/vehicles', vehiclePricingRoutes);
app.use('/api/vehicles', vehicleIntegrationRoutes);

// Sample vehicles route (fallback when database is not available)
const sampleVehiclesRoute = require('./src/routes/sampleVehicles');
app.use('/api/sample-vehicles', sampleVehiclesRoute);
app.use('/api/vehicle-bookings', vehicleBookingRoutes);
app.use('/api/vehicle-booking-requests', vehicleBookingRequestRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/revenue', revenueRoutes);

// Custom trip API routes
app.use('/api/custom-trips', customTripRoutes);

// Notification API routes
app.use('/api/notifications', notificationRoutes);

// Support API routes
const supportRoutes = require('./src/routes/support');
app.use('/api/support', supportRoutes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);



// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Only listen if not running in Vercel (Vercel handles listening)
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production') {
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log('Unhandled Rejection at:', promise, 'reason:', err);
      server.close(() => {
        process.exit(1);
      });
    });
  }
};

if (require.main === module) {
  // Running locally
  startServer();
} else {
  // Running on Vercel - connect to DB immediately on cold start
  // #region agent log
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/7c6e8849-56f1-4e76-b71f-22ff13d2ad7f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:296',message:'Vercel mode - calling initDB',data:{isMainModule:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
  }
  // #endregion
  // Initialize DB but don't block module export if it fails
  dbInitPromise = initDB().catch(err => {
    console.error('❌ Failed to initialize DB on module load:', err.message);
    // Don't throw - allow the app to export even if DB init fails
  });
}

module.exports = app;

