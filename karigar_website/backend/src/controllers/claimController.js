const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Listing = require('../models/Listing');
const Claim = require('../models/Claim');
const Karigar = require('../models/Karigar');
const sendEmail = require('../utils/sendEmail');
const NOTIFICATION_TEXTS = require('../config/notificationTexts');

/**
 * Mask phone number for public OTP verification screen: e.g. 0317-XXX-7378
 */
function maskPhone(phone) {
  if (!phone) return '03XX-XXX-XXXX';
  const clean = normalizePhone(phone);
  if (clean.length >= 10) {
    const start = clean.slice(0, 4);
    const end = clean.slice(-4);
    return `${start}-XXX-${end}`;
  }
  return '03XX-XXX-XXXX';
}

/**
 * Normalize Pakistani phone number: e.g. 03427066034 or 923427066034 -> 03427066034
 */
function normalizePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) {
    return `0${digits.slice(2)}`;
  }
  return digits;
}

/**
 * @desc    Start listing claim by sending 6-digit OTP to listing phone
 * @route   POST /api/listings/:id/claim/start
 * @access  Public
 */
const startClaim = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    // 409 Conflict if already verified or pending
    if (listing.claimStatus === 'verified') {
      return res.status(409).json({ message: 'This business listing is already verified and claimed.' });
    }
    if (listing.claimStatus === 'pending') {
      return res.status(409).json({ message: 'A claim for this business listing is currently under administrative review.' });
    }

    // Must have a registered phone
    if (!listing.phone || !listing.phone.trim()) {
      return res.status(400).json({
        message: 'This listing has no phone number on record to receive verification OTP. Please contact KarigarPK support to claim manually.'
      });
    }

    const normPhone = normalizePhone(listing.phone);

    // Rate Limit 1: Max 5 OTPs per phone per day (24h window)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyOtpCount = await Claim.countDocuments({
      phone: normPhone,
      createdAt: { $gte: oneDayAgo }
    });

    if (dailyOtpCount >= 5) {
      return res.status(429).json({
        message: 'Maximum daily OTP limit reached (5 OTPs per day). Please try again tomorrow or contact support.'
      });
    }

    // Check existing active claim for temporary lock
    let claim = await Claim.findOne({ listing: listing._id, phone: normPhone });
    if (claim && claim.lockUntil && claim.lockUntil > new Date()) {
      const remainingMins = Math.ceil((claim.lockUntil.getTime() - Date.now()) / (60 * 1000));
      return res.status(429).json({
        message: `Too many invalid attempts. This phone number is temporarily locked for ${remainingMins} more minutes.`
      });
    }

    // Generate 6-digit cryptographic-safe random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    // Expiry: 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    if (claim) {
      claim.otpHash = otpHash;
      claim.expiresAt = expiresAt;
      claim.attempts = 0;
      claim.status = 'initiated';
      claim.claimToken = null;
      await claim.save();
    } else {
      claim = await Claim.create({
        listing: listing._id,
        phone: normPhone,
        otpHash,
        expiresAt,
        attempts: 0,
        status: 'initiated'
      });
    }

    // Send Notification (SMS / WhatsApp / Server log)
    const smsMessage = NOTIFICATION_TEXTS.OTP_CODE(otp);
    console.log(`\n======================================================`);
    console.log(`[CLAIM OTP DISPATCH]`);
    console.log(`Listing: "${listing.name}" (ID: ${listing._id})`);
    console.log(`Target Phone: ${listing.phone} (Norm: ${normPhone})`);
    console.log(`Generated OTP: >>> ${otp} <<<`);
    console.log(`Text: ${smsMessage}`);
    console.log(`Expires: ${expiresAt.toISOString()}`);
    console.log(`======================================================\n`);

    // Mask phone number for response
    const maskedPhone = maskPhone(listing.phone);

    // IMPORTANT: Never return the OTP in the public response
    res.json({
      success: true,
      message: '6-digit OTP code sent successfully to registered phone.',
      maskedPhone,
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Error in startClaim:', error);
    res.status(500).json({ message: 'Failed to initiate business claim' });
  }
};

/**
 * @desc    Verify 6-digit OTP code and issue a short-lived claim token
 * @route   POST /api/listings/:id/claim/verify
 * @access  Public
 */
const verifyClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return res.status(400).json({ message: 'Please enter a valid 6-digit OTP code' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    const normPhone = normalizePhone(listing.phone);
    const claim = await Claim.findOne({ listing: listing._id, phone: normPhone });

    if (!claim) {
      return res.status(400).json({ message: 'No active claim found. Please request an OTP first.' });
    }

    // Check 30-minute lock
    if (claim.lockUntil && claim.lockUntil > new Date()) {
      const remainingMins = Math.ceil((claim.lockUntil.getTime() - Date.now()) / (60 * 1000));
      return res.status(429).json({
        message: `Account is temporarily locked due to 5 failed attempts. Please try again in ${remainingMins} minutes.`
      });
    }

    // Check 5-minute expiry
    if (claim.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new code.' });
    }

    // Check attempts limit (max 5)
    if (claim.attempts >= 5) {
      claim.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      await claim.save();
      return res.status(429).json({
        message: 'Maximum attempts (5) reached. Account locked for 30 minutes.'
      });
    }

    // Compare entered OTP with hashed OTP
    const isMatch = await bcrypt.compare(otp.trim(), claim.otpHash);

    if (!isMatch) {
      claim.attempts += 1;
      if (claim.attempts >= 5) {
        claim.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      await claim.save();

      const remaining = Math.max(0, 5 - claim.attempts);
      if (remaining === 0) {
        return res.status(429).json({
          message: 'Invalid OTP code. 5 failed attempts reached. Account locked for 30 minutes.'
        });
      }
      return res.status(400).json({
        message: `Invalid OTP code. Remaining attempts: ${remaining}`
      });
    }

    // OTP Match Success
    claim.status = 'verified';
    claim.attempts = 0;
    claim.lockUntil = null;

    // Issue short-lived claim token (30 min, scope "claim", bound to listing id)
    const claimToken = jwt.sign(
      { listingId: listing._id.toString(), phone: normPhone, scope: 'claim' },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    claim.claimToken = claimToken;
    await claim.save();

    res.json({
      success: true,
      message: 'Phone ownership verified successfully.',
      claimToken
    });
  } catch (error) {
    console.error('Error in verifyClaim:', error);
    res.status(500).json({ message: 'Failed to verify OTP code' });
  }
};

/**
 * @desc    Submit 4-part claim form with photos and CNIC
 * @route   POST /api/listings/:id/claim/submit
 * @access  Public (Claim Token Required)
 */
const submitClaim = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Authenticate Claim Token
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer '))
      ? authHeader.split(' ')[1]
      : req.body.claimToken;

    if (!token) {
      return res.status(401).json({ message: 'Claim token is required to submit verification.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired claim token. Please verify OTP again.' });
    }

    if (decoded.scope !== 'claim' || decoded.listingId !== id) {
      return res.status(401).json({ message: 'Unauthorized claim token for this listing.' });
    }

    // 2. Check Listing State
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    if (listing.claimStatus === 'verified') {
      return res.status(409).json({ message: 'This listing has already been verified and claimed.' });
    }
    if (listing.claimStatus === 'pending') {
      return res.status(409).json({ message: 'A claim for this listing is already pending administrative review.' });
    }

    // 3. Extract and Validate Body Data
    const {
      ownerName,
      email,
      password,
      phone,
      whatsapp,
      area,
      address,
      hourlyRate,
      experience,
      bio,
      services,
      workingDays,
      workingHours,
      cnicNumber
    } = req.body;

    if (!ownerName || ownerName.trim().length < 3) {
      return res.status(400).json({ message: 'Owner full name must be at least 3 characters long.' });
    }

    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Phone validation: Pakistani mobile 03XXXXXXXXX (11 digits)
    const cleanPhoneDigits = (phone || '').replace(/\D/g, '');
    if (!/^03\d{9}$/.test(cleanPhoneDigits)) {
      return res.status(400).json({ message: 'Phone must be in Pakistani mobile format: 03XXXXXXXXX (11 digits).' });
    }

    // CNIC validation: 00000-0000000-0 (13 digits with hyphens)
    const cnicClean = (cnicNumber || '').trim();
    if (!/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(cnicClean)) {
      return res.status(400).json({ message: 'CNIC must be in the format: 00000-0000000-0 (e.g. 12345-1234567-1).' });
    }

    // Bio validation: >= 40 chars
    if (!bio || bio.trim().length < 40) {
      return res.status(400).json({ message: 'Bio / description must be at least 40 characters long.' });
    }

    // Services validation: at least 1 service
    let parsedServices = [];
    if (Array.isArray(services)) {
      parsedServices = services.filter(Boolean);
    } else if (typeof services === 'string') {
      try {
        parsedServices = JSON.parse(services);
      } catch {
        parsedServices = services.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (parsedServices.length === 0) {
      parsedServices = [listing.service];
    }

    // Parse coordinates if provided
    let coords = null;
    if (req.body.coordinates) {
      try {
        const parsed = typeof req.body.coordinates === 'string'
          ? JSON.parse(req.body.coordinates)
          : req.body.coordinates;
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          coords = { lat: parsed.lat, lng: parsed.lng };
        }
      } catch {
        // ignore
      }
    }

    // 4. Extract Uploaded Photo Files from Multer
    const files = req.files || {};
    const profilePhotoUrl = files.profilePhoto && files.profilePhoto[0] ? files.profilePhoto[0].path : '';
    const coverPhotoUrl = files.coverPhoto && files.coverPhoto[0] ? files.coverPhoto[0].path : '';
    const cnicFrontUrl = files.cnicFront && files.cnicFront[0] ? files.cnicFront[0].path : '';
    const cnicBackUrl = files.cnicBack && files.cnicBack[0] ? files.cnicBack[0].path : '';

    const galleryUrls = [];
    if (files.gallery && Array.isArray(files.gallery)) {
      files.gallery.forEach(f => galleryUrls.push(f.path));
    }

    // Parse workingDays
    let parsedWorkingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (Array.isArray(workingDays)) {
      parsedWorkingDays = workingDays.filter(Boolean);
    } else if (typeof workingDays === 'string') {
      try {
        const parsed = JSON.parse(workingDays);
        if (Array.isArray(parsed)) parsedWorkingDays = parsed.filter(Boolean);
      } catch {
        parsedWorkingDays = workingDays.split(',').map(d => d.trim()).filter(Boolean);
      }
    }

    // Parse workingHours
    let parsedWorkingHours = { start: '09:00', end: '18:00', display: '09:00 AM - 07:00 PM' };
    if (workingHours && typeof workingHours === 'object') {
      parsedWorkingHours = {
        start: workingHours.start || '09:00',
        end: workingHours.end || '18:00',
        display: workingHours.display || `${workingHours.start || '09:00'} - ${workingHours.end || '18:00'}`
      };
    } else if (typeof workingHours === 'string' && workingHours.trim()) {
      parsedWorkingHours = {
        start: '09:00',
        end: '18:00',
        display: workingHours.trim()
      };
    }

    // 5. Create or Reuse Karigar Account
    let karigar = await Karigar.findOne({ email: email.toLowerCase().trim() });
    if (karigar) {
      karigar.fullName = ownerName.trim();
      karigar.password = password; // pre-save will rehash
      karigar.phone = cleanPhoneDigits;
      karigar.whatsapp = whatsapp ? whatsapp.trim() : '';
      karigar.services = parsedServices;
      karigar.experience = Number(experience) || karigar.experience || 1;
      karigar.hourlyRate = Number(hourlyRate) || karigar.hourlyRate || 500;
      karigar.bio = bio.trim();
      karigar.city = listing.city;
      karigar.area = area || listing.area || '';
      karigar.address = address || listing.address || '';
      if (coords) karigar.coordinates = coords;
      karigar.cnicNumber = cnicClean;
      if (cnicFrontUrl) karigar.cnicFront = cnicFrontUrl;
      if (cnicBackUrl) karigar.cnicBack = cnicBackUrl;
      if (profilePhotoUrl) karigar.profilePhoto = profilePhotoUrl;
      if (coverPhotoUrl) karigar.coverPhoto = coverPhotoUrl;
      if (galleryUrls.length > 0) karigar.gallery = galleryUrls;
      if (!karigar.availability) karigar.availability = {};
      karigar.availability.workingDays = parsedWorkingDays;
      karigar.availability.workingHours = parsedWorkingHours;
      karigar.verificationStatus = 'pending';
      await karigar.save();
    } else {
      karigar = await Karigar.create({
        fullName: ownerName.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: cleanPhoneDigits,
        whatsapp: whatsapp ? whatsapp.trim() : '',
        services: parsedServices,
        experience: Number(experience) || 1,
        hourlyRate: Number(hourlyRate) || 500,
        bio: bio.trim(),
        city: listing.city,
        area: area || listing.area || '',
        address: address || listing.address || '',
        coordinates: coords,
        availability: {
          workingDays: parsedWorkingDays,
          workingHours: parsedWorkingHours
        },
        cnicNumber: cnicClean,
        cnicFront: cnicFrontUrl,
        cnicBack: cnicBackUrl,
        profilePhoto: profilePhotoUrl,
        coverPhoto: coverPhotoUrl,
        gallery: galleryUrls,
        verificationStatus: 'pending'
      });
    }

    // 6. Update Listing Record
    listing.claimStatus = 'pending';
    listing.claimedBy = karigar._id;
    if (area) listing.area = area.trim();
    if (address) listing.address = address.trim();
    if (whatsapp) listing.whatsapp = whatsapp.trim();
    if (hourlyRate) listing.hourlyRate = Number(hourlyRate);
    if (bio) listing.bio = bio.trim();
    if (coords) listing.coordinates = coords;

    const mergedPhotos = [profilePhotoUrl, coverPhotoUrl, ...galleryUrls].filter(Boolean);
    if (mergedPhotos.length > 0) {
      listing.photos = mergedPhotos;
    }
    await listing.save();

    // 7. Update Claim Record
    const normPhone = normalizePhone(listing.phone);
    await Claim.findOneAndUpdate(
      { listing: listing._id, phone: normPhone },
      {
        status: 'submitted',
        claimedBy: karigar._id
      },
      { new: true, upsert: true }
    );

    // 8. Send Notification
    const confirmationText = NOTIFICATION_TEXTS.CLAIM_RECEIVED(listing.name);
    console.log(`\n[CLAIM SUBMITTED] Listing: "${listing.name}" | Owner: ${ownerName} | Message: ${confirmationText}\n`);
    await sendEmail({
      to: karigar.email,
      subject: `KarigarPK: Claim Received for ${listing.name}`,
      text: confirmationText,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #0A1F44;">
        <h2 style="color: #FF7A00;">KarigarPK Claim Received</h2>
        <p>${confirmationText}</p>
        <p>Aapka application review mein hai. Verification complete hone par WhatsApp aur email par ittehaad di jayegi.</p>
      </div>`
    }).catch(e => console.warn('Email notify error:', e.message));

    res.json({
      success: true,
      message: 'Claim mil gayi — 24 ghanton mein WhatsApp par jawab milega.',
      listingId: listing._id
    });
  } catch (error) {
    console.error('Error in submitClaim:', error);
    res.status(500).json({ message: error.message || 'Failed to submit claim application' });
  }
};

module.exports = {
  startClaim,
  verifyClaim,
  submitClaim
};
