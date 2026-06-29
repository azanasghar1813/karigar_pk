const Karigar = require('../models/Karigar');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new karigar
// @route   POST /api/karigars/register
// @access  Public
const registerKarigar = async (req, res) => {
  try {
    const { fullName, email, password, phone, services, experience, city, cnicNumber, bio } = req.body;

    const karigarExists = await Karigar.findOne({ email });
    if (karigarExists) {
      return res.status(400).json({ message: 'Karigar already exists' });
    }

    const cnicFront = req.files && req.files.cnicFrontFile ? req.files.cnicFrontFile[0].path : '';
    const cnicBack = req.files && req.files.cnicBackFile ? req.files.cnicBackFile[0].path : '';
    const profilePhoto = req.files && req.files.profilePhoto ? req.files.profilePhoto[0].path : '';

    const parsedServices = typeof services === 'string' ? JSON.parse(services) : services;

    const karigar = await Karigar.create({
      fullName, email, password, phone, services: parsedServices, experience, city, cnicNumber, bio,
      cnicFront, cnicBack, profilePhoto
    });

    if (karigar) {
      res.status(201).json({
        _id: karigar._id,
        fullName: karigar.fullName,
        email: karigar.email,
        role: 'karigar',
        token: generateToken(karigar._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid karigar data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth karigar & get token
// @route   POST /api/karigars/login
// @access  Public
const loginKarigar = async (req, res) => {
  try {
    const { email, password } = req.body;

    const karigar = await Karigar.findOne({ email });

    if (karigar && (await karigar.matchPassword(password))) {
      res.json({
        _id: karigar._id,
        fullName: karigar.fullName,
        email: karigar.email,
        role: 'karigar',
        token: generateToken(karigar._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved karigars (public search)
// @route   GET /api/karigars
// @access  Public
const getKarigars = async (req, res) => {
  try {
    const { service, city } = req.query;
    // Only approved karigars are publicly searchable
    let query = { verificationStatus: 'approved' };
    if (service && service !== 'All') query.services = new RegExp(service, 'i');
    if (city) query.city = new RegExp(city, 'i');

    const karigars = await Karigar.find(query).select('-password');
    res.json(karigars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getKarigarById = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.params.id).select('-password');
    if (karigar) {
      res.json(karigar);
    } else {
      res.status(404).json({ message: 'Karigar not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update FCM Token for Karigar
// @route   POST /api/karigars/fcm-token
// @access  Private (Karigar)
const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) return res.status(400).json({ message: 'No FCM token provided' });

    const karigar = await Karigar.findById(req.karigar._id);
    if (!karigar) return res.status(404).json({ message: 'Karigar not found' });

    karigar.fcmToken = fcmToken;
    await karigar.save();
    res.json({ message: 'FCM Token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerKarigar, loginKarigar, getKarigars, getKarigarById, updateFcmToken };
