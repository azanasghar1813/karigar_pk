const express = require('express');
const router = express.Router();
const { protectKarigar } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getDashboardStats,
  toggleAvailability,
  getMyBookings,
  updateBookingStatus,
  requestApproval,
  updateProfile,
  getMyReviews,
  updateSchedule
} = require('../controllers/karigarPortalController');

// All portal routes require Karigar authentication
router.use(protectKarigar);

router.get('/reviews', getMyReviews);
router.put('/schedule', updateSchedule);

router.get('/stats', getDashboardStats);
router.put('/availability', toggleAvailability);

router.get('/bookings', getMyBookings);
router.put('/bookings/:id/status', updateBookingStatus);

router.put('/request-approval', requestApproval);

router.put('/profile', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cnicFrontFile', maxCount: 1 },
  { name: 'cnicBackFile', maxCount: 1 }
]), updateProfile);

module.exports = router;
