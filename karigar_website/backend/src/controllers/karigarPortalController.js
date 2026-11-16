const Karigar = require('../models/Karigar');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const User = require('../models/User');
const Listing = require('../models/Listing');
const admin = require('../config/firebase');

// @desc    Get dashboard stats
// @route   GET /api/karigar-portal/stats
// @access  Private/Karigar
const getDashboardStats = async (req, res) => {
  try {
    const karigarId = req.karigar._id;

    const newRequestsCount = await Booking.countDocuments({ karigar: karigarId, status: 'pending' });
    
    // Scheduled today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const scheduledTodayCount = await Booking.countDocuments({ 
      karigar: karigarId, 
      status: { $in: ['confirmed', 'in-progress'] },
      date: { $gte: startOfDay, $lte: endOfDay } 
    });

    // We can do real earnings later. For MVP, sum of completed jobs? 
    // Wait, MVP didn't track price in Booking schema. Let's just return a placeholder or calculate based on count * hourlyRate.
    const completedCount = await Booking.countDocuments({ karigar: karigarId, status: 'completed' });
    const estimatedEarnings = completedCount * req.karigar.hourlyRate; // Rough estimate

    const reviewsCount = await Review.countDocuments({ karigar: karigarId });

    res.json({
      newRequests: newRequestsCount,
      scheduledToday: scheduledTodayCount,
      estimatedEarnings,
      rating: req.karigar.rating,
      reviewsCount,
      isOnline: req.karigar.isOnline,
      availability: req.karigar.availability
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle available status
// @route   PUT /api/karigar-portal/availability
// @access  Private/Karigar
const toggleAvailability = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.karigar._id);
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });
    
    const updatedKarigar = await Karigar.findByIdAndUpdate(
      req.karigar._id,
      { isOnline: !karigar.isOnline },
      { new: true, runValidators: false }
    );
    
    res.json({ isOnline: updatedKarigar.isOnline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for karigar
// @route   GET /api/karigar-portal/bookings
// @access  Private/Karigar
const getMyBookings = async (req, res) => {
  try {
    const status = req.query.status; // pending, upcoming, completed
    let statusFilter = {};
    if (status === 'pending') statusFilter = { status: 'pending' };
    else if (status === 'upcoming') statusFilter = { status: { $in: ['confirmed', 'in-progress'] } };
    else if (status === 'completed') statusFilter = { status: 'completed' };
    
    const bookings = await Booking.find({ karigar: req.karigar._id, ...statusFilter })
      .populate('customer', status === 'pending' ? 'fullName address' : 'fullName phone address')
      .sort({ date: 1 });
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/karigar-portal/bookings/:id/status
// @access  Private/Karigar
const updateBookingStatus = async (req, res) => {
  try {
    const { status, declineReason } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, karigar: req.karigar._id });
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = status;
    if (declineReason) booking.declineReason = declineReason;
    
    await booking.save();

    // Emit Socket.io event to Customer
    if (req.io) {
      req.io.to(booking.customer.toString()).emit('bookingStatusChanged', booking);
    }

    // Send Push Notification to Customer
    const customer = await User.findById(booking.customer);
    if (customer && customer.fcmToken) {
      try {
        await admin.messaging().send({
          token: customer.fcmToken,
          notification: {
            title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            body: `Your booking for ${booking.serviceType} has been ${status}.`
          },
          data: {
            bookingId: booking._id.toString(),
            type: 'booking_update'
          }
        });
      } catch (err) {
        console.error('FCM send error (updateBookingStatus):', err);
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request approval from admin
// @route   PUT /api/karigar-portal/request-approval
// @access  Private/Karigar
const requestApproval = async (req, res) => {
  try {
    const { message } = req.body;
    const karigar = await Karigar.findById(req.karigar._id);
    karigar.approvalMessage = message || "Please approve my application.";
    await karigar.save();
    res.json({ message: 'Approval request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Karigar Profile
// @route   PUT /api/karigar-portal/profile
// @access  Private/Karigar
const updateProfile = async (req, res) => {
  try {
    const { bio, hourlyRate, services } = req.body;
    const karigar = await Karigar.findById(req.karigar._id);

    if (bio) karigar.bio = bio;
    if (hourlyRate) karigar.hourlyRate = hourlyRate;
    if (services) karigar.services = typeof services === 'string' ? JSON.parse(services) : services;
    
    if (req.files && req.files.profilePhoto) {
      karigar.profilePhoto = req.files.profilePhoto[0].path;
    }

    if (req.files && (req.files.cnicFrontFile || req.files.cnicBackFile)) {
      if (req.files.cnicFrontFile) karigar.cnicFront = req.files.cnicFrontFile[0].path;
      if (req.files.cnicBackFile) karigar.cnicBack = req.files.cnicBackFile[0].path;
      // Reset verification
      karigar.verificationStatus = 'pending';
    }

    await karigar.save();
    res.json(karigar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my reviews
// @route   GET /api/karigar-portal/reviews
// @access  Private/Karigar
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ karigar: req.karigar._id, hidden: { $ne: true } })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update my schedule
// @route   PUT /api/karigar-portal/schedule
// @access  Private/Karigar
const updateSchedule = async (req, res) => {
  try {
    const { workingDays, workingHours, blockedDates } = req.body;
    const karigar = await Karigar.findById(req.karigar._id);

    if (!karigar.availability) {
      karigar.availability = {};
    }

    if (workingDays) karigar.availability.workingDays = workingDays;
    if (workingHours) karigar.availability.workingHours = workingHours;
    if (blockedDates) karigar.availability.blockedDates = blockedDates;

    await karigar.save();
    res.json(karigar.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in karigar profile and verification status
// @route   GET /api/karigar-portal/profile
// @access  Private/Karigar
const getMyProfile = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.karigar._id);
    if (!karigar) {
      return res.status(404).json({ message: 'Karigar profile not found' });
    }
    const listing = await Listing.findOne({ claimedBy: karigar._id });
    res.json({
      karigar,
      listing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resubmit corrected field for admin review
// @route   PUT /api/karigar-portal/correction
// @access  Private/Karigar
const resubmitCorrection = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.karigar._id);
    if (!karigar) {
      return res.status(404).json({ message: 'Karigar not found' });
    }

    const { field, value } = req.body;
    if (field && value !== undefined) {
      if (field === 'bio') karigar.bio = value;
      else if (field === 'hourlyRate') karigar.hourlyRate = Number(value);
      else if (field === 'address') karigar.address = value;
      else if (field === 'area') karigar.area = value;
      else if (field === 'phone') karigar.phone = value;
      else if (field === 'fullName') karigar.fullName = value;
      else if (field === 'cnicNumber') karigar.cnicNumber = value;
    }

    if (req.files) {
      if (req.files.profilePhoto) karigar.profilePhoto = req.files.profilePhoto[0].path;
      if (req.files.coverPhoto) karigar.coverPhoto = req.files.coverPhoto[0].path;
      if (req.files.cnicFrontFile) karigar.cnicFront = req.files.cnicFrontFile[0].path;
      if (req.files.cnicBackFile) karigar.cnicBack = req.files.cnicBackFile[0].path;
    }

    // Clear correctionNote and reset verificationStatus to pending
    karigar.correctionNote = { field: '', message: '' };
    karigar.verificationStatus = 'pending';
    await karigar.save();

    // If listing exists, sync it
    const listing = await Listing.findOne({ claimedBy: karigar._id });
    if (listing) {
      listing.claimStatus = 'pending';
      if (field === 'bio') listing.bio = value;
      if (field === 'hourlyRate') listing.hourlyRate = Number(value);
      if (field === 'address') listing.address = value;
      if (field === 'area') listing.area = value;
      await listing.save();
    }

    res.json({
      success: true,
      message: 'Correction resubmitted for admin review.',
      karigar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  toggleAvailability,
  getMyBookings,
  updateBookingStatus,
  requestApproval,
  updateProfile,
  getMyReviews,
  updateSchedule,
  getMyProfile,
  resubmitCorrection
};
