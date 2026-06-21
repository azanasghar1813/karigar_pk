const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { karigar, serviceType, date, time, address, notes } = req.body;

    if (!karigar || !serviceType || !date || !time || !address) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const booking = new Booking({
      customer: req.user._id,
      karigar,
      serviceType,
      date,
      time,
      address,
      notes
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).populate('karigar', 'name profession phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings };
