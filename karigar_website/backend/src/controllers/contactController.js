const Contact = require('../models/Contact');

// @desc    Submit a contact/lead message
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message, source } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required' });
    }

    const contact = new Contact({
      name,
      email: email || '',
      phone: phone || '',
      subject: subject || '',
      message,
      source: source || 'contact_page',
    });
    await contact.save();

    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContactForm };

