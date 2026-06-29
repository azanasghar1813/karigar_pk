require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('./config/firebase');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const authRoutes = require('./routes/authRoutes');
const karigarRoutes = require('./routes/karigarRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const leadRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const karigarPortalRoutes = require('./routes/karigarPortalRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
// Connect to MongoDB
connectDB();

const app = express();
const path = require('path');

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust this for production
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  // Clients join a room named by their user/karigar ID to receive private events
  socket.on('join', (userId) => {
    socket.join(userId.toString());
    console.log(`User/Karigar ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Inject io into the request object for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());
// Cross-Origin Resource Sharing
const allowedOrigins = [
  'http://localhost:3000',
  'https://karigarpk.live',
  'https://www.karigarpk.live',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If Vercel generates dynamic preview URLs, you might want to regex match them here
      // For now, allow all for flexibility, or strict for production. We'll use a dynamic check:
      if (origin.endsWith('vercel.app')) return callback(null, true);
      
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
// Compress payloads
app.use(compression());

// Global Rate Limiting: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', globalLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb to prevent payload attacks

// No local static uploads serving anymore, migrated to Cloudinary

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/karigars', karigarRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/karigar-portal', karigarPortalRoutes);
app.use('/api/reviews', reviewRoutes);
// Base route
app.get('/', (req, res) => {
  res.send('Karigar API is running securely...');
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered. Please use another value.`;
  }
  
  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen for Socket.io
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
