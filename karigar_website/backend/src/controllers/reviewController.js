const Review = require('../models/Review');
const Karigar = require('../models/Karigar');

// @desc    Get reviews for a specific Karigar
// @route   GET /api/reviews
// @access  Public
const getKarigarReviews = async (req, res) => {
  try {
    const { karigerId } = req.query;
    
    if (!karigerId) {
      return res.status(400).json({ message: 'karigerId query parameter is required' });
    }

    const karigar = await Karigar.findById(karigerId);
    if (!karigar) {
      return res.status(404).json({ message: 'Karigar not found' });
    }

    const reviews = await Review.find({ karigar: karigerId, hidden: false })
      .populate('customer', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getKarigarReviews };
