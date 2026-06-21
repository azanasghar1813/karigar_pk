const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  karigar: { type: mongoose.Schema.Types.ObjectId, ref: 'Karigar', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxLength: 1000 },
  featured: { type: Boolean, default: false }, // admin toggles for homepage testimonials
  hidden: { type: Boolean, default: false },    // admin soft-hide without deleting
}, { timestamps: true });

// Indexes
reviewSchema.index({ karigar: 1, hidden: 1 });
reviewSchema.index({ featured: 1, hidden: 1 });

module.exports = mongoose.model('Review', reviewSchema);
