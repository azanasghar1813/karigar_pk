require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');

const defaultServices = [
  {
    name: 'Electrician',
    icon: '⚡',
    description: 'Professional electrical wiring, repair, installation and maintenance services in your city',
  },
  {
    name: 'Plumber',
    icon: '💧',
    description: 'Expert plumbing solutions for pipes, leaks, installations and drain cleaning',
  },
  {
    name: 'Carpenter',
    icon: '🪵',
    description: 'Skilled carpenter for furniture, doors, windows and structural work',
  },
  {
    name: 'AC Repair',
    icon: '❄️',
    description: 'Air conditioning maintenance, repair and installation services',
  },
  {
    name: 'Painter',
    icon: '🎨',
    description: 'Professional interior and exterior painting services',
  },
  {
    name: 'Locksmith',
    icon: '🔐',
    description: 'Lock repair, replacement and key cutting services',
  },
  {
    name: 'CCTV Install',
    icon: '📹',
    description: 'Security camera installation and maintenance',
  },
  {
    name: 'General Repair',
    icon: '🔧',
    description: 'All-in-one repair services for home maintenance',
  },
  {
    name: 'Household Chores',
    icon: '🛍️',
    description: 'Simple daily chores support such as bringing grocery or utility items.',
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const svc of defaultServices) {
      const existing = await Service.findOne({ name: svc.name });
      if (!existing) {
        await Service.create(svc);
        console.log(`✅ Added service: ${svc.name}`);
      } else {
        console.log(`ℹ️ Service already exists: ${svc.name}`);
      }
    }

    console.log('\n✅ Service seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedServices();
