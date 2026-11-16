const express = require('express');
const router = express.Router();
const {
  getListings,
  getAreasWithCounts,
  getListingById
} = require('../controllers/listingController');

// Areas aggregation with breakdown per service (must precede /:id)
router.get('/areas', getAreasWithCounts);

// Directory search & paginated listings
router.get('/', getListings);

// Single listing profile
router.get('/:id', getListingById);

module.exports = router;
