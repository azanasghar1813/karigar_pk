/**
 * Seed Admin Script
 * Usage: node src/scripts/seedAdmin.js
 *
 * Creates or updates the admin user in MongoDB.
 * After running, log in at /login with these credentials.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_EMAIL = 'azanasghar1813@gmail.com';
const ADMIN_PASSWORD = 'Azan@181314';
const ADMIN_NAME = 'Azan (Admin)';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // Set the PLAIN password — the pre-save hook will hash it exactly once
      existing.role = 'admin';
      existing.fullName = ADMIN_NAME;
      existing.password = ADMIN_PASSWORD; // plain text — pre-save hook hashes it
      await existing.save();
      console.log(`✅ Updated existing user "${ADMIN_EMAIL}" → role: admin`);
    } else {
      // Create fresh admin user with plain password — pre-save hook hashes it
      await User.create({
        fullName: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // plain text — pre-save hook hashes it
        phone: '03000000000',
        cnic: '0000000000000',
        address: 'Lahore, Pakistan',
        role: 'admin',
      });
      console.log(`✅ Created admin user: ${ADMIN_EMAIL}`);
    }

    console.log('\n🔐 Admin Credentials:');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     admin`);
    console.log('\nGo to /login and log in with the above credentials.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();
