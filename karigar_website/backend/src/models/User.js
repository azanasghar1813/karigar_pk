const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxLength: 100 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 20 
  },
  cnic: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 15,
    match: [/^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/, 'Please add a valid CNIC (e.g., 12345-1234567-1)']
  },
  address: { type: String, required: true, trim: true, maxLength: 500 },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isRestricted: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Add Indexes
userSchema.index({ phone: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
