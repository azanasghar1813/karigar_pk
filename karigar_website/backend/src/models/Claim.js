const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    otpHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['initiated', 'verified', 'submitted', 'approved', 'rejected', 'correction-needed'],
      default: 'initiated'
    },
    claimToken: {
      type: String,
      default: null
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Karigar',
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    correctionNote: {
      field: { type: String, default: '' },
      message: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

claimSchema.index({ listing: 1, phone: 1 });
claimSchema.index({ phone: 1, createdAt: -1 });

module.exports = mongoose.model('Claim', claimSchema);
