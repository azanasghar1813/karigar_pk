const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, forgotPassword, resetPassword, updateFcmToken, googleLogin, updateProfile, logout } = require('../controllers/authController');
const { registerKarigar } = require('../controllers/karigarController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/register', registerUser);
router.post('/register/karigar', upload.fields([
  { name: 'cnicFront', maxCount: 1 },
  { name: 'cnicFrontFile', maxCount: 1 },
  { name: 'cnicBack', maxCount: 1 },
  { name: 'cnicBackFile', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), registerKarigar);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/fcm-token', protect, updateFcmToken);
router.post('/google-login', googleLogin);
module.exports = router;
