const jwt = require('jsonwebtoken');
const User = require('../models/User');
const trackActivity = require('./activityMiddleware');

// Protect routes — verify JWT, attach user to req
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        if (req.user.isRestricted) {
          return res.status(403).json({ message: 'Your account has been restricted. Please contact support.' });
        }
        trackActivity(req, res, () => {}); // Fire and forget
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only — must come after protect
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: admin only' });
  }
};

// Protect Karigar routes
const protectKarigar = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const Karigar = require('../models/Karigar');
      req.karigar = await Karigar.findById(decoded.id).select('-password');
      
      if (!req.karigar) {
        return res.status(401).json({ message: 'Not authorized as Karigar' });
      }
      if (req.karigar.isRestricted) {
        return res.status(403).json({ message: 'Your account has been restricted. Please contact support.' });
      }
      trackActivity(req, res, () => {}); // Fire and forget
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect, adminOnly, protectKarigar };
