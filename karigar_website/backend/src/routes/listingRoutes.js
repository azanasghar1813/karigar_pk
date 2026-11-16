const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  getListings,
  getAreasWithCounts,
  getListingById
} = require('../controllers/listingController');
const {
  startClaim,
  verifyClaim,
  submitClaim
} = require('../controllers/claimController');

// Areas aggregation with breakdown per service (must precede /:id)
router.get('/areas', getAreasWithCounts);

// Directory search & paginated listings
router.get('/', getListings);

// ─── CLAIM PROCESS ENDPOINTS ───
// Step 1: Request 6-digit OTP to listing phone
router.post('/:id/claim/start', startClaim);

// Step 2: Verify 6-digit OTP code & get short-lived claim token
router.post('/:id/claim/verify', verifyClaim);

// Step 3: Submit 4-part claim form with photos and verification docs
router.post(
  '/:id/claim/submit',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'gallery', maxCount: 6 },
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 }
  ]),
  submitClaim
);

// Single listing profile (must come after specific /:id/... sub-routes)
router.get('/:id', getListingById);

module.exports = router;
