const Karigar = require('../models/Karigar');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Service = require('../models/Service');
const Review = require('../models/Review');
const User = require('../models/User');

// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const [
      pendingKarigars,
      approvedKarigars,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalLeads,
      newLeads
    ] = await Promise.all([
      Karigar.countDocuments({ verificationStatus: 'pending' }),
      Karigar.countDocuments({ verificationStatus: 'approved' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' })
    ]);

    res.json({
      karigars: { pending: pendingKarigars, approved: approvedKarigars },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },
      leads: { total: totalLeads, newThisWeek: newLeads }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const users = await User.find({ lastActive: { $gte: fifteenMinsAgo } }).select('fullName email role lastActive');
    const karigars = await Karigar.find({ lastActive: { $gte: fifteenMinsAgo } }).select('fullName email verificationStatus lastActive isOnline');
    
    res.json({ users, karigars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// KARIGAR MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all karigars with filters
// @route   GET /api/admin/karigars
// @access  Admin
const getKarigars = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.verificationStatus = req.query.status;
    
    const karigars = await Karigar.find(filter)
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'fullName email');
      
    res.json(karigars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching karigars' });
  }
};

// @desc    Approve karigar
// @route   PUT /api/admin/karigars/:id/approve
// @access  Admin
const approveKarigar = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.params.id);
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });

    karigar.verificationStatus = 'approved';
    karigar.isOnline = true;
    karigar.approvedBy = req.user._id;
    karigar.approvedAt = Date.now();
    karigar.rejectionReason = undefined;

    await karigar.save();
    res.json({ message: 'Karigar approved successfully', karigar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error approving karigar' });
  }
};

// @desc    Reject karigar
// @route   PUT /api/admin/karigars/:id/reject
// @access  Admin
const rejectKarigar = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Rejection reason is required' });

    const karigar = await Karigar.findByIdAndDelete(req.params.id);
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });

    res.json({ message: 'Karigar application rejected and data deleted completely' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error rejecting karigar' });
  }
};

// @desc    Toggle Karigar Restriction
// @route   PUT /api/admin/karigars/:id/restrict
// @access  Admin
const toggleKarigarRestriction = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.params.id);
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });

    karigar.isRestricted = !karigar.isRestricted;
    await karigar.save();
    
    res.json({ message: `Karigar ${karigar.isRestricted ? 'restricted' : 'unrestricted'} successfully`, karigar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error toggling karigar restriction' });
  }
};

// @desc    Delete Karigar (Hard Delete + Cascading)
// @route   DELETE /api/admin/karigars/:id
// @access  Admin
const deleteKarigar = async (req, res) => {
  try {
    const karigar = await Karigar.findByIdAndDelete(req.params.id);
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });

    // Cascade delete bookings and reviews
    await Booking.deleteMany({ karigar: req.params.id });
    await Review.deleteMany({ karigarId: req.params.id });

    res.json({ message: 'Karigar and all associated data deleted completely' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting karigar' });
  }
};

// ─────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all users (customers)
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const filter = { role: 'customer' };
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    res.json({ data: users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Toggle User Restriction
// @route   PUT /api/admin/users/:id/restrict
// @access  Admin
const toggleUserRestriction = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isRestricted = !user.isRestricted;
    await user.save();
    
    res.json({ message: `User ${user.isRestricted ? 'restricted' : 'unrestricted'} successfully`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error toggling user restriction' });
  }
};

// @desc    Delete User (Hard Delete + Cascading)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cascade delete bookings and reviews
    await Booking.deleteMany({ customer: req.params.id });
    await Review.deleteMany({ customer: req.params.id });

    res.json({ message: 'User and all associated data deleted completely' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// ─────────────────────────────────────────────
// BOOKING MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Admin
const getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      
      // We need to look up Customer and Karigar by name/phone. 
      // The easiest way for a robust search in MongoDB without aggregations is to match on fields directly or use populated matching, but since they are ObjectIds, we either need to aggregate or fetch matching users first.
      // Let's fetch matching users/karigars.
      const [matchingUsers, matchingKarigars] = await Promise.all([
        User.find({ $or: [{ fullName: searchRegex }, { phone: searchRegex }] }).select('_id'),
        Karigar.find({ $or: [{ fullName: searchRegex }, { phone: searchRegex }] }).select('_id')
      ]);

      const userIds = matchingUsers.map(u => u._id);
      const karigarIds = matchingKarigars.map(k => k._id);

      filter.$or = [
        { serviceType: searchRegex },
        { address: searchRegex },
        { customer: { $in: userIds } },
        { karigar: { $in: karigarIds } }
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate('customer', 'fullName email phone')
      .populate('karigar', 'fullName phone')
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);
    res.json({ data: bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

// @desc    Reassign booking to a different karigar
// @route   PUT /api/admin/bookings/:id/reassign
// @access  Admin
const reassignBooking = async (req, res) => {
  try {
    const { karigarId } = req.body;
    if (!karigarId) return res.status(400).json({ message: 'Karigar ID is required' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.karigar = karigarId;
    // Set status to pending if it's being reassigned
    if (booking.status === 'confirmed' || booking.status === 'in-progress') {
       booking.status = 'pending';
    }
    
    await booking.save();
    
    // Return populated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'fullName email phone')
      .populate('karigar', 'fullName phone');

    res.json({ message: 'Booking reassigned successfully', booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error reassigning booking' });
  }
};

// ─────────────────────────────────────────────
// LEADS (CONTACT MESSAGES)
// ─────────────────────────────────────────────

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Admin
const getLeads = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const leads = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);
    res.json({ data: leads, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
};

// @desc    Update lead status
// @route   PUT /api/admin/leads/:id/status
// @access  Admin
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Contact.findById(req.params.id);
    
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.status = status;
    await lead.save();

    res.json({ message: 'Lead status updated', lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating lead' });
  }
};

// @desc    Update lead admin notes
// @route   PUT /api/admin/leads/:id/notes
// @access  Admin
const updateLeadNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const lead = await Contact.findById(req.params.id);
    
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.adminNotes = notes;
    await lead.save();

    res.json({ message: 'Lead notes updated', lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating lead notes' });
  }
};

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Admin
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
};

// @desc    Create a service
// @route   POST /api/admin/services
// @access  Admin
const createService = async (req, res) => {
  try {
    const { name, icon, image, description, tags, isPopular } = req.body;
    const service = await Service.create({ name, icon, image, description, tags, isPopular });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating service' });
  }
};

// @desc    Update a service
// @route   PUT /api/admin/services/:id
// @access  Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating service' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/admin/services/:id
// @access  Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting service' });
  }
};

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Admin
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customer', 'fullName email')
      .populate('karigarId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// @desc    Toggle review feature
// @route   PUT /api/admin/reviews/:id/feature
// @access  Admin
const toggleFeatureReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.isFeatured = !review.isFeatured;
    await review.save();

    res.json({ message: 'Review featured status toggled', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error featuring review' });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update karigar hourly rate
// @route   PUT /api/admin/karigars/:id/rate
// @access  Private/Admin
const updateKarigarRate = async (req, res) => {
  try {
    const { rate } = req.body;
    if (!rate || isNaN(rate)) {
      return res.status(400).json({ message: 'Valid rate is required' });
    }
    
    const karigar = await Karigar.findByIdAndUpdate(
      req.params.id,
      { hourlyRate: Number(rate) },
      { new: true }
    );
    
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });
    res.json(karigar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getActiveUsers,
  getKarigars,
  approveKarigar,
  rejectKarigar,
  toggleKarigarRestriction,
  deleteKarigar,
  updateKarigarRate,
  getUsers,
  toggleUserRestriction,
  deleteUser,
  getBookings,
  updateBookingStatus,
  reassignBooking,
  getLeads,
  updateLeadStatus,
  updateLeadNotes,
  getServices,
  createService,
  updateService,
  deleteService,
  getReviews,
  toggleFeatureReview,
  deleteReview
};
