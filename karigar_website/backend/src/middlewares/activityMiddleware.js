const User = require('../models/User');
const Karigar = require('../models/Karigar');

const trackActivity = async (req, res, next) => {
  const now = new Date();
  try {
    if (req.user) {
      User.findByIdAndUpdate(req.user._id, { lastActive: now }).exec();
    }
    if (req.karigar) {
      Karigar.findByIdAndUpdate(req.karigar._id, { lastActive: now }).exec();
    }
  } catch (error) {
    console.error('Activity tracking error:', error);
  }
  next();
};

module.exports = trackActivity;
