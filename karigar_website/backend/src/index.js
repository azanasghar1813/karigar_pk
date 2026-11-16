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
const listingRoutes = require('./routes/listingRoutes');
// Connect to MongoDB
connectDB();

const app = express();
const path = require('path');

const jwt = require('jsonwebtoken');

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Socket.io JWT authentication middleware (Security Hardening)
io.use((socket, next) => {
  const authHeader = socket.handshake.headers?.authorization;
  const token = socket.handshake.auth?.token || (authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
    } catch (err) {
      console.warn('Socket token verification failed:', err.message);
    }
  }
  next();
});

// Socket.io connection logic
io.on('connection', (socket) => {
  // Automatically join their verified user room
  if (socket.userId) {
    socket.join(socket.userId.toString());
  }
  
  // Clients join a room named by their user/karigar ID to receive private events
  socket.on('join', (userId) => {
    if (!userId) return;
    // Security check: If authenticated, prevent joining other users' rooms
    if (socket.userId && socket.userId.toString() !== userId.toString()) {
      console.warn(`Blocked unauthorized socket room join: ${socket.userId} attempted ${userId}`);
      return;
    }
    socket.join(userId.toString());
  });

  socket.on('disconnect', () => {
    // client disconnected
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
  'http://localhost:5173',
  'http://localhost:5174',
  'https://karigarpk.live',
  'https://www.karigarpk.live',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // Allow preview deployments from Vercel
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

// Global Rate Limiting: 1000 requests per 15 minutes per IP for general browsing
const globalLimiter = rateLimit({
  max: 1000,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', globalLimiter);

// Specific strict rate limiter for authentication routes (brute-force defense)
const authLimiter = rateLimit({
  max: 20,
  windowMs: 15 * 60 * 1000,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/karigars/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb to prevent payload attacks

// Health check endpoints (for server warmup & uptime monitoring)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

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
app.use('/api/listings', listingRoutes);
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
