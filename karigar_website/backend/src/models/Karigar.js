const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const karigarSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxLength: 100 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 20 
  },
  services: [{ type: String, required: true, trim: true, maxLength: 50 }],
  experience: { type: Number, min: 0, max: 100 },
  city: { type: String, required: true, trim: true, maxLength: 100 },
  cnicNumber: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 15,
    match: [/^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/, 'Please add a valid CNIC (e.g., 12345-1234567-1)']
  },
  cnicFront: { type: String },
  cnicBack: { type: String },
  profilePhoto: { type: String },
  hourlyRate: { type: Number, default: 500, min: 0 },
  bio: { type: String, trim: true, maxLength: 1000 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0, min: 0 },
  isRestricted: { type: Boolean, default: false },
  fcmToken: { type: String },
  // Verification workflow
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String, trim: true, maxLength: 500 },
  approvalMessage: { type: String, trim: true, maxLength: 500 }, // For karigars to nudge admin when pending
  // Online/Activity
  isOnline: { type: Boolean, default: false }, // Available for bookings toggle
  lastActive: { type: Date },
  availability: {
    workingDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    blockedDates: [{ type: String }] // Array of ISO date strings e.g. "2026-06-20"
  },
  // Audit trail
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Indexes for performance
karigarSchema.index({ city: 1, services: 1, verificationStatus: 1 });
karigarSchema.index({ phone: 1 });

karigarSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

karigarSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Karigar', karigarSchema);
