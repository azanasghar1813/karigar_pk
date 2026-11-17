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
    const { fullName, email, password, phone, services, experience, city, cnicNumber, bio, address, hourlyRate, accountType } = req.body;

    const [karigarExists, userExists] = await Promise.all([
      Karigar.findOne({ email }),
      require('../models/User').findOne({ email })
    ]);

    if (karigarExists || userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const cnicFront = (req.files && (req.files.cnicFront?.[0]?.path || req.files.cnicFrontFile?.[0]?.path)) || '';
    const cnicBack = (req.files && (req.files.cnicBack?.[0]?.path || req.files.cnicBackFile?.[0]?.path)) || '';
    const profilePhoto = (req.files && req.files.profilePhoto?.[0]?.path) || '';

    let rawServices = req.body['services[]'] || services || [];
    let parsedServices = [];
    if (typeof rawServices === 'string') {
      try {
        const parsed = JSON.parse(rawServices);
        parsedServices = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        parsedServices = [rawServices];
      }
    } else if (Array.isArray(rawServices)) {
      parsedServices = rawServices;
    }

    if (!parsedServices.length) {
      parsedServices = ['General Karigar'];
    }

    const karigar = await Karigar.create({
      fullName: (fullName || '').trim(),
      email: (email || '').trim().toLowerCase(),
      password,
      phone: (phone || '').trim(),
      services: parsedServices,
      experience: Number(experience) || 1,
      city: city || 'Karachi',
      address: address || '',
      hourlyRate: Number(hourlyRate) || 500,
      cnicNumber: (cnicNumber || '').trim(),
      bio: bio || '',
      cnicFront,
      cnicBack,
      profilePhoto,
      verificationStatus: 'pending'
    });

    if (karigar) {
      res.status(201).json({
        _id: karigar._id,
        fullName: karigar.fullName,
        email: karigar.email,
        role: 'karigar',
        verificationStatus: karigar.verificationStatus,
        token: generateToken(karigar._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid karigar data' });
    }
  } catch (error) {
    console.error('registerKarigar error:', error);
    res.status(500).json({ message: error.message || 'Server error during karigar registration' });
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

// Public fields whitelist to prevent leaking sensitive documents/PII (CNIC, email, phone)
const PUBLIC_FIELDS = '_id fullName profilePhoto services city bio experience hourlyRate rating reviewsCount availability isOnline verificationStatus createdAt';

// @desc    Get all approved karigars (public search)
// @route   GET /api/karigars
// @access  Public
const getKarigars = async (req, res) => {
  try {
    const { service, city } = req.query;
    // Only approved karigars are publicly searchable
    let query = { verificationStatus: 'approved' };
    if (service && service !== 'All') query.services = new RegExp(service, 'i');
    if (city && city !== 'All Cities' && city !== 'Your City') query.city = new RegExp(city, 'i');

    const karigars = await Karigar.find(query).select(PUBLIC_FIELDS).lean();
    res.json(karigars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getKarigarById = async (req, res) => {
  try {
    const karigar = await Karigar.findById(req.params.id).select(PUBLIC_FIELDS).lean();
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
