const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, trim: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, trim: true },
  customerPhone: { type: String, trim: true },
  karigar: { type: mongoose.Schema.Types.ObjectId, ref: 'Karigar', required: true },
  karigarName: { type: String, trim: true },
  serviceType: { type: String, required: true, trim: true, maxLength: 50 },
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true, maxLength: 20 },
  address: { type: String, required: true, trim: true, maxLength: 500 },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  serviceCharge: { type: Number, default: 0 },
  processingFee: { type: Number, default: 50 },
  totalAmount: { type: Number, default: 550 },
  paymentMethod: { type: String, default: 'Cash on Service' },
  status: { type: String, enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String, trim: true, maxLength: 1000 },
  declineReason: { type: String, trim: true, maxLength: 500 }
}, { timestamps: true });

// Auto-generate booking reference e.g. BK-XXXXXX
bookingSchema.pre('save', function () {
  if (!this.bookingReference) {
    const idStr = this._id ? this._id.toString() : '';
    this.bookingReference = 'BK-' + (idStr ? idStr.slice(-6).toUpperCase() : Math.random().toString(36).substr(2, 6).toUpperCase());
  }
  if (!this.totalAmount && this.serviceCharge !== undefined) {
    this.totalAmount = (Number(this.serviceCharge) || 0) + (Number(this.processingFee) || 50);
  }
});

// Indexes
bookingSchema.index({ karigar: 1, status: 1 });
bookingSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
