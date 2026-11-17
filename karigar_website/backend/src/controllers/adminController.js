const Karigar = require('../models/Karigar');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Service = require('../models/Service');
const Review = require('../models/Review');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Claim = require('../models/Claim');
const sendEmail = require('../utils/sendEmail');
const NOTIFICATION_TEXTS = require('../config/notificationTexts');

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

    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { services: searchRegex }
      ];
    }
    
    const [karigars, allCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Karigar.find(filter)
        .select('-password +cnicNumber +cnicFront +cnicBack')
        .sort({ createdAt: -1 })
        .populate('approvedBy', 'fullName email'),
      Karigar.countDocuments(),
      Karigar.countDocuments({ verificationStatus: 'pending' }),
      Karigar.countDocuments({ verificationStatus: 'approved' }),
      Karigar.countDocuments({ verificationStatus: 'rejected' })
    ]);
      
    res.json({
      karigars,
      counts: {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching karigars' });
  }
};

// @desc    Get single karigar full record (Admin only - for CNIC verification)
// @route   GET /api/admin/karigars/:id
// @access  Admin
const getKarigarById = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.params.id)
      .select('-password +cnicNumber +cnicFront +cnicBack')
      .populate('approvedBy', 'fullName email');
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });
    res.json(karigar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching karigar details' });
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
      
      const [matchingUsers, matchingKarigars] = await Promise.all([
        User.find({ $or: [{ fullName: searchRegex }, { phone: searchRegex }] }).select('_id'),
        Karigar.find({ $or: [{ fullName: searchRegex }, { phone: searchRegex }] }).select('_id')
      ]);

      const userIds = matchingUsers.map(u => u._id);
      const karigarIds = matchingKarigars.map(k => k._id);

      filter.$or = [
        { bookingReference: searchRegex },
        { customerName: searchRegex },
        { karigarName: searchRegex },
        { serviceType: searchRegex },
        { address: searchRegex },
        { customer: { $in: userIds } },
        { karigar: { $in: karigarIds } }
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const rawBookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate('customer', 'fullName email phone')
      .populate('karigar', 'fullName phone')
      .skip(skip)
      .limit(limit);

    // Collect IDs of bookings where karigar failed to populate
    const unpopulatedListingIds = [];
    rawBookings.forEach(b => {
      if (!b.karigar) {
        const rawId = b.get ? b.get('karigar') : b.karigar;
        if (rawId) unpopulatedListingIds.push(rawId);
      }
    });

    let listingsMap = {};
    if (unpopulatedListingIds.length > 0) {
      const Listing = require('../models/Listing');
      const foundListings = await Listing.find({ _id: { $in: unpopulatedListingIds } }).select('name phone');
      foundListings.forEach(l => {
        listingsMap[l._id.toString()] = { fullName: l.name, phone: l.phone };
      });
    }

    const bookings = rawBookings.map(b => {
      const bObj = b.toObject ? b.toObject() : b;
      if (!bObj.bookingReference) {
        bObj.bookingReference = 'BK-' + bObj._id.toString().slice(-6).toUpperCase();
      }
      if (!bObj.karigar) {
        const rawId = (b.get ? b.get('karigar') : b.karigar)?.toString();
        if (rawId && listingsMap[rawId]) {
          bObj.karigar = listingsMap[rawId];
        } else if (bObj.karigarName) {
          bObj.karigar = { fullName: bObj.karigarName, phone: '' };
        }
      }
      if (!bObj.customer && bObj.customerName) {
        bObj.customer = { fullName: bObj.customerName, phone: bObj.customerPhone || '' };
      }
      if (!bObj.totalAmount) {
        bObj.totalAmount = (Number(bObj.serviceCharge) || 500) + (Number(bObj.processingFee) || 50);
      }
      return bObj;
    });

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

    // Send FCM Notifications
    try {
      const populatedBooking = await Booking.findById(booking._id).populate('customer').populate('karigar');
      const adminModule = require('../config/firebase');
      
      if (populatedBooking.customer && populatedBooking.customer.fcmToken) {
        await adminModule.messaging().send({
          token: populatedBooking.customer.fcmToken,
          notification: {
            title: 'Booking Status Updated',
            body: `Your booking for ${populatedBooking.serviceType} is now ${status}.`
          }
        });
      }
      
      if (populatedBooking.karigar && populatedBooking.karigar.fcmToken) {
        await adminModule.messaging().send({
          token: populatedBooking.karigar.fcmToken,
          notification: {
            title: 'Booking Status Updated',
            body: `Booking status for ${populatedBooking.serviceType} changed to ${status}.`
          }
        });
      }
    } catch (err) {
      console.error('FCM send error (updateBookingStatus):', err);
    }

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
      .populate('karigar', 'fullName phone')
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

    review.featured = !review.featured;
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

// @desc    Get directory listings for admin with counts by claimStatus
// @route   GET /api/admin/listings
// @access  Admin
const getAdminListings = async (req, res) => {
  try {
    const { claimStatus, city, q } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip = (page - 1) * limit;

    const [unclaimed, pending, verified, rejected, total] = await Promise.all([
      Listing.countDocuments({ claimStatus: 'unclaimed' }),
      Listing.countDocuments({ claimStatus: 'pending' }),
      Listing.countDocuments({ claimStatus: 'verified' }),
      Listing.countDocuments({ claimStatus: 'rejected' }),
      Listing.countDocuments()
    ]);

    const query = {};
    if (claimStatus) query.claimStatus = claimStatus;
    if (city && city !== 'All') query.city = new RegExp(`^${city}$`, 'i');
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [{ name: regex }, { phone: regex }, { service: regex }, { area: regex }];
    }

    const [filteredTotal, listings] = await Promise.all([
      Listing.countDocuments(query),
      Listing.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    res.json({
      counts: {
        unclaimed,
        pending,
        verified,
        rejected,
        total
      },
      listings,
      total: filteredTotal,
      page,
      totalPages: Math.ceil(filteredTotal / limit),
      limit
    });
  } catch (error) {
    console.error('Error in getAdminListings:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// CLAIMS QUEUE & VERIFICATION REVIEW
// ─────────────────────────────────────────────

// @desc    Get all listings in pending claim queue joined with claimant Karigar data
// @route   GET /api/admin/claims
// @access  Admin
const getClaimsQueue = async (req, res) => {
  try {
    const claims = await Listing.find({
      claimStatus: { $in: ['pending', 'rejected'] },
      claimedBy: { $ne: null }
    })
      .populate({
        path: 'claimedBy',
        select: '+cnicNumber +cnicFront +cnicBack'
      })
      .sort({ updatedAt: -1 })
      .lean();

    // Also get active claim records for correctionNotes
    const listingIds = claims.map(c => c._id);
    const claimRecords = await Claim.find({ listing: { $in: listingIds } }).lean();
    const claimRecordMap = {};
    claimRecords.forEach(cr => {
      claimRecordMap[cr.listing.toString()] = cr;
    });

    const enrichedClaims = claims.map(c => ({
      ...c,
      claimDetails: claimRecordMap[c._id.toString()] || null
    }));

    res.json({
      total: enrichedClaims.length,
      claims: enrichedClaims
    });
  } catch (error) {
    console.error('Error in getClaimsQueue:', error);
    res.status(500).json({ message: 'Failed to fetch claims queue' });
  }
};

// @desc    Approve business listing claim
// @route   PUT /api/admin/claims/:listingId/approve
// @access  Admin
const approveClaim = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.claimedBy) return res.status(400).json({ message: 'Listing has no attached claimant' });

    const karigar = await Karigar.findById(listing.claimedBy);
    if (!karigar) return res.status(404).json({ message: 'Claimant Karigar profile not found' });

    // 1. Approve Karigar account
    karigar.verificationStatus = 'approved';
    karigar.approvedBy = req.user._id;
    karigar.approvedAt = new Date();
    karigar.rejectionReason = '';
    karigar.correctionNote = { field: '', message: '' };
    await karigar.save();

    // 2. Update Listing: public profile source
    listing.claimStatus = 'verified';
    if (karigar.hourlyRate) listing.hourlyRate = karigar.hourlyRate;
    if (karigar.bio) listing.bio = karigar.bio;
    if (karigar.area) listing.area = karigar.area;
    if (karigar.address) listing.address = karigar.address;
    if (karigar.coordinates) listing.coordinates = karigar.coordinates;
    const allPhotos = [karigar.profilePhoto, karigar.coverPhoto, ...(karigar.gallery || [])].filter(Boolean);
    if (allPhotos.length > 0) listing.photos = allPhotos;
    await listing.save();

    // 3. Update Claim document
    await Claim.findOneAndUpdate(
      { listing: listing._id },
      { status: 'approved', rejectionReason: '' }
    );

    // 4. Send Approval Notification
    const approveMsg = NOTIFICATION_TEXTS.CLAIM_APPROVED(listing.name);
    console.log(`\n[CLAIM APPROVED] Listing: "${listing.name}" | Owner: ${karigar.fullName}\n`);
    await sendEmail({
      to: karigar.email,
      subject: `KarigarPK: Business Claim Approved for ${listing.name}`,
      text: approveMsg,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #0A1F44;">
        <h2 style="color: #22C55E;">Mubarak Ho! Claim Approved</h2>
        <p>${approveMsg}</p>
        <p>Aapka business ab Verified badge ke sath live hai aur customers aapko direct book kar sakte hain.</p>
      </div>`
    }).catch(e => console.warn('Email notify error:', e.message));

    res.json({
      success: true,
      message: 'Claim approved successfully. Listing is now verified.'
    });
  } catch (error) {
    console.error('Error in approveClaim:', error);
    res.status(500).json({ message: error.message || 'Failed to approve claim' });
  }
};

// @desc    Reject business listing claim with written reason
// @route   PUT /api/admin/claims/:listingId/reject
// @access  Admin
const rejectClaim = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ message: 'Written rejection reason is required (at least 5 characters).' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // 1. Update Karigar
    if (listing.claimedBy) {
      await Karigar.findByIdAndUpdate(listing.claimedBy, {
        verificationStatus: 'rejected',
        rejectionReason: reason.trim()
      });
    }

    // 2. Update Listing
    listing.claimStatus = 'rejected';
    await listing.save();

    // 3. Update Claim
    const claim = await Claim.findOneAndUpdate(
      { listing: listing._id },
      { status: 'rejected', rejectionReason: reason.trim() },
      { new: true }
    );

    // 4. Send Rejection Notification
    const rejectMsg = NOTIFICATION_TEXTS.CLAIM_REJECTED(listing.name, reason.trim());
    if (listing.claimedBy) {
      const karigar = await Karigar.findById(listing.claimedBy);
      if (karigar) {
        await sendEmail({
          to: karigar.email,
          subject: `KarigarPK: Claim Status for ${listing.name}`,
          text: rejectMsg,
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #0A1F44;">
            <h2 style="color: #EF4444;">Claim Status Update</h2>
            <p>${rejectMsg}</p>
            <p><strong>Wajah (Reason):</strong> ${reason.trim()}</p>
          </div>`
        }).catch(e => console.warn('Email notify error:', e.message));
      }
    }

    res.json({
      success: true,
      message: 'Claim rejected with written reason stored.'
    });
  } catch (error) {
    console.error('Error in rejectClaim:', error);
    res.status(500).json({ message: error.message || 'Failed to reject claim' });
  }
};

// @desc    Request correction from owner without full rejection
// @route   PUT /api/admin/claims/:listingId/correction
// @access  Admin
const requestClaimCorrection = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { field, message } = req.body;

    if (!field || !message || message.trim().length < 5) {
      return res.status(400).json({ message: 'Field name and clear correction message are required.' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // 1. Update Karigar
    if (listing.claimedBy) {
      await Karigar.findByIdAndUpdate(listing.claimedBy, {
        verificationStatus: 'pending',
        correctionNote: { field: field.trim(), message: message.trim() }
      });
    }

    // 2. Update Claim
    await Claim.findOneAndUpdate(
      { listing: listing._id },
      {
        status: 'correction-needed',
        correctionNote: { field: field.trim(), message: message.trim() }
      }
    );

    // 3. Send Notification
    const correctionMsg = NOTIFICATION_TEXTS.CLAIM_CORRECTION(listing.name, field.trim(), message.trim());
    if (listing.claimedBy) {
      const karigar = await Karigar.findById(listing.claimedBy);
      if (karigar) {
        await sendEmail({
          to: karigar.email,
          subject: `KarigarPK: Action Needed for ${listing.name}`,
          text: correctionMsg,
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #0A1F44;">
            <h2 style="color: #F59E0B;">Correction Needed on your Claim</h2>
            <p>${correctionMsg}</p>
            <p><strong>Field:</strong> ${field.trim()}</p>
            <p><strong>Message:</strong> ${message.trim()}</p>
          </div>`
        }).catch(e => console.warn('Email notify error:', e.message));
      }
    }

    res.json({
      success: true,
      message: 'Correction request dispatched to owner.'
    });
  } catch (error) {
    console.error('Error in requestClaimCorrection:', error);
    res.status(500).json({ message: error.message || 'Failed to request correction' });
  }
};

// @desc    Fraud action: unclaim a listing and detach claimant
// @route   PUT /api/admin/claims/:listingId/unclaim
// @access  Admin
const unclaimListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.claimStatus = 'unclaimed';
    listing.claimedBy = null;
    await listing.save();

    await Claim.deleteMany({ listing: listing._id });

    res.json({
      success: true,
      message: 'Listing unclaimed successfully. Status reset to unclaimed.'
    });
  } catch (error) {
    console.error('Error in unclaimListing:', error);
    res.status(500).json({ message: error.message || 'Failed to unclaim listing' });
  }
};

// @desc    Mark business permanently closed
// @route   PUT /api/admin/claims/:listingId/close
// @access  Admin
const markListingClosed = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.isActive = false;
    await listing.save();

    res.json({
      success: true,
      message: 'Listing marked closed and deactivated from public directory.'
    });
  } catch (error) {
    console.error('Error in markListingClosed:', error);
    res.status(500).json({ message: error.message || 'Failed to mark closed' });
  }
};

// @desc    Send claim invitation notification to listing phone / contact
// @route   POST /api/admin/listings/:id/send-invite
// @access  Admin
const sendClaimInvite = async (req, res) => {
  try {
    const id = req.params.id || req.params.listingId;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!listing.phone || !listing.phone.trim()) {
      return res.status(400).json({ message: 'Listing has no phone number on record to receive invitation.' });
    }

    const inviteText = NOTIFICATION_TEXTS.CLAIM_INVITE(listing.name);
    console.log(`\n======================================================`);
    console.log(`[CLAIM INVITE DISPATCH]`);
    console.log(`Listing: "${listing.name}" (ID: ${listing._id})`);
    console.log(`Target Phone: ${listing.phone}`);
    console.log(`Message: ${inviteText}`);
    console.log(`======================================================\n`);

    if (listing.email) {
      await sendEmail({
        to: listing.email,
        subject: `KarigarPK: Claim your business profile for ${listing.name}`,
        text: inviteText,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #0A1F44;">
          <h2 style="color: #FF7A00;">KarigarPK Business Profile Ready</h2>
          <p>${inviteText}</p>
          <a href="https://karigarpk.live/claim/${listing._id}" style="display: inline-block; background-color: #FF7A00; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Claim Listing Now</a>
        </div>`
      }).catch(e => console.warn('Email notify error (sendClaimInvite):', e.message));
    }

    res.json({
      success: true,
      message: `Claim invite sent to ${listing.phone} for "${listing.name}".`,
      inviteText
    });
  } catch (error) {
    console.error('Error in sendClaimInvite:', error);
    res.status(500).json({ message: error.message || 'Failed to send claim invite' });
  }
};

module.exports = {
  getStats,
  getActiveUsers,
  getKarigars,
  getKarigarById,
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
  deleteReview,
  getAdminListings,
  getClaimsQueue,
  approveClaim,
  rejectClaim,
  requestClaimCorrection,
  unclaimListing,
  markListingClosed,
  sendClaimInvite
};
