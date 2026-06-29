const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, forgotPassword, resetPassword, updateFcmToken, googleLogin } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/fcm-token', protect, updateFcmToken);
router.post('/google-login', googleLogin);
module.exports = router;

