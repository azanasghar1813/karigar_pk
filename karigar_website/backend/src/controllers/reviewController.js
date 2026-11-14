const Review = require('../models/Review');
const Karigar = require('../models/Karigar');

// @desc    Get reviews for a specific Karigar
// @route   GET /api/reviews
// @access  Public
const getKarigarReviews = async (req, res) => {
  try {
    const targetId = req.query.karigarId || req.query.karigerId || req.query.karigar;
    
    if (!targetId) {
      return res.status(400).json({ message: 'karigarId query parameter is required' });
    }

    const karigar = await Karigar.findById(targetId);
    if (!karigar) {
      return res.status(404).json({ message: 'Karigar not found' });
    }

    const reviews = await Review.find({ karigar: targetId, hidden: { $ne: true } })
      .populate('customer', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getKarigarReviews };
