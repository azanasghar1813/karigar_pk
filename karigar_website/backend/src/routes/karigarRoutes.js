const express = require('express');
const router = express.Router();
const { registerKarigar, loginKarigar, getKarigars, getKarigarById, updateFcmToken } = require('../controllers/karigarController');
const { protectKarigar } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/').get(getKarigars);
router.route('/register').post(upload.fields([
  { name: 'cnicFrontFile', maxCount: 1 },
  { name: 'cnicBackFile', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), registerKarigar);
router.route('/login').post(loginKarigar);
router.route('/:id').get(getKarigarById);
router.route('/fcm-token').post(protectKarigar, updateFcmToken);
module.exports = router;
