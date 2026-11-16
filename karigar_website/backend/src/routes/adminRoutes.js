const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/adminController');

// All routes require authentication + admin role
router.use(protect, adminOnly);

// Dashboard & Active Users
router.get('/stats', getStats);
router.get('/active-users', getActiveUsers);

// Karigar approvals & verification
router.get('/karigars', getKarigars);
router.get('/karigars/:id', getKarigarById);
router.put('/karigars/:id/approve', approveKarigar);
router.put('/karigars/:id/reject', rejectKarigar);
router.put('/karigars/:id/restrict', toggleKarigarRestriction);
router.put('/karigars/:id/rate', updateKarigarRate);
router.delete('/karigars/:id', deleteKarigar);

// User Management
router.get('/users', getUsers);
router.put('/users/:id/restrict', toggleUserRestriction);
router.delete('/users/:id', deleteUser);

// Services CRUD
router.get('/services', getServices); // Oh wait, getServices wasn't exported in adminController.js!
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Bookings oversight
router.get('/bookings', getBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.put('/bookings/:id/reassign', reassignBooking);

// Leads inbox
router.get('/leads', getLeads);
router.put('/leads/:id/status', updateLeadStatus);
router.put('/leads/:id/notes', updateLeadNotes);

// Reviews moderation
router.get('/reviews', getReviews);
router.put('/reviews/:id/feature', toggleFeatureReview);
router.delete('/reviews/:id', deleteReview);

// Directory listings & Claim Invites
router.get('/listings', getAdminListings);
router.post('/listings/:id/send-invite', sendClaimInvite);
router.post('/claims/:listingId/invite', sendClaimInvite);

// Claims Queue & Verification Actions
router.get('/claims', getClaimsQueue);
router.put('/claims/:listingId/approve', approveClaim);
router.put('/claims/:listingId/reject', rejectClaim);
router.put('/claims/:listingId/correction', requestClaimCorrection);
router.put('/claims/:listingId/unclaim', unclaimListing);
router.put('/claims/:listingId/close', markListingClosed);

module.exports = router;
