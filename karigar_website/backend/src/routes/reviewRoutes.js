const express = require('express');
const router = express.Router();
const { getKarigarReviews } = require('../controllers/reviewController');

router.route('/').get(getKarigarReviews);

module.exports = router;
