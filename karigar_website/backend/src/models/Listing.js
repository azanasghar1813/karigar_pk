const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxLength: 150
    },
    service: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
      maxLength: 100
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      default: 'Lahore',
      trim: true,
      maxLength: 100
    },
    area: {
      type: String,
      trim: true,
      default: '',
      maxLength: 150
    },
    address: {
      type: String,
      trim: true,
      default: '',
      maxLength: 500
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxLength: 50
    },
    whatsapp: {
      type: String,
      trim: true,
      default: '',
      maxLength: 50
    },
    rating: {
      type: Number,
      default: null,
      min: 0,
      max: 5
    },
    source: {
      type: String,
      trim: true,
      default: ''
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: ''
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    photos: {
      type: [String],
      default: []
    },
    hourlyRate: {
      type: Number,
      default: null
    },
    bio: {
      type: String,
      default: ''
    },
    claimStatus: {
      type: String,
      enum: ['unclaimed', 'pending', 'verified', 'rejected'],
      default: 'unclaimed'
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Karigar',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Internal notes kept out of public queries by default
    notes: {
      type: String,
      select: false,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes
listingSchema.index({ city: 1, area: 1, service: 1 });
listingSchema.index({ phone: 1 });
listingSchema.index({ name: 'text' });
listingSchema.index({ claimStatus: 1 });

module.exports = mongoose.model('Listing', listingSchema);
