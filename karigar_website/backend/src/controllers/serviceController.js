const Service = require('../models/Service');

// @desc    Get all active services for public site
// @route   GET /api/services
// @access  Public
const getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveServices,
};
