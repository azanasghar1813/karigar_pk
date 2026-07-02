const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Karigar = require('../models/Karigar');
const admin = require('../config/firebase');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { karigar, serviceType, date, time, address, latitude, longitude, notes } = req.body;

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
      location: (latitude && longitude) ? { latitude, longitude } : undefined,
      notes
    });

    const createdBooking = await booking.save();

    // Populate karigar to get fcmToken
    const karigarUser = await Karigar.findById(karigar);

    // Emit Socket.io event to Karigar
    if (req.io) {
      req.io.to(karigar.toString()).emit('newBooking', createdBooking);
    }

    // Send Push Notification
    if (karigarUser && karigarUser.fcmToken) {
      try {
        await admin.messaging().send({
          token: karigarUser.fcmToken,
          notification: {
            title: 'New Booking Request',
            body: `You have a new ${serviceType} booking request for ${date}.`
          },
          data: {
            bookingId: createdBooking._id.toString(),
            type: 'new_booking'
          }
        });
      } catch (err) {
        console.error('FCM send error (createBooking):', err);
      }
    }

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

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only pending or upcoming bookings can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel a booking in this status' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    // Emit Socket.io event to Karigar
    if (req.io) {
      req.io.to(booking.karigar.toString()).emit('bookingCancelled', booking);
    }

    // Send Push Notification
    const karigarUser = await Karigar.findById(booking.karigar);
    if (karigarUser && karigarUser.fcmToken) {
      try {
        await admin.messaging().send({
          token: karigarUser.fcmToken,
          notification: {
            title: 'Booking Cancelled',
            body: `A booking for ${booking.serviceType} has been cancelled by the customer.`
          }
        });
      } catch (err) {
        console.error('FCM send error (cancelBooking):', err);
      }
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate and review a booking
// @route   POST /api/bookings/:id/rate
// @access  Private
const rateBooking = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }
    
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings' });
    }
    
    // Check if already reviewed
    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }
    
    const newReview = new Review({
      karigar: booking.karigar,
      customer: req.user._id,
      booking: booking._id,
      rating,
      comment: review
    });
    
    await newReview.save();
    
    // Optional: Calculate and update average rating for the Karigar
    const allReviews = await Review.find({ karigar: booking.karigar });
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;
    await Karigar.findByIdAndUpdate(booking.karigar, { rating: avgRating });
    
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('karigar', 'fullName phone profilePhoto services hourlyRate')
      .populate('customer', 'fullName phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking, rateBooking };
