const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  karigar: { type: mongoose.Schema.Types.ObjectId, ref: 'Karigar', required: true },
  serviceType: { type: String, required: true, trim: true, maxLength: 50 },
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true, maxLength: 20 },
  address: { type: String, required: true, trim: true, maxLength: 500 },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  status: { type: String, enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String, trim: true, maxLength: 1000 },
  declineReason: { type: String, trim: true, maxLength: 500 }
}, { timestamps: true });

// Indexes
bookingSchema.index({ karigar: 1, status: 1 });
bookingSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
