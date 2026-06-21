const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 100 },
  email: { 
    type: String, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: { type: String, trim: true, maxLength: 20 },
  subject: { type: String, trim: true, maxLength: 200 },
  message: { type: String, required: true, trim: true, maxLength: 2000 },
  source: {
    type: String,
    enum: ['contact_page', 'homepage', 'callback_fab', 'other'],
    default: 'contact_page'
  },
  adminNotes: { type: String, default: '', trim: true, maxLength: 2000 },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  }
}, { timestamps: true });

// Indexes
contactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);

