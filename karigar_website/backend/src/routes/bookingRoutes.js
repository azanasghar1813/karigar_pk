const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, rateBooking } = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/cancel').patch(protect, cancelBooking);
router.route('/:id/rate').post(protect, rateBooking);

module.exports = router;
