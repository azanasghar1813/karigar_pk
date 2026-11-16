export const SITE_PHONE_E164 = '+923427066034'
export const SITE_PHONE_DISPLAY = '+92 342 7066034'
export const SITE_PHONE_WA = '923427066034'
export const SITE_EMAIL = 'karigarpk.live@gmail.com'

// Shared Single Source of Truth for Launch Cities across Pakistan
export const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Faisalabad',
  'Multan',
  'Rawalpindi',
  'Peshawar',
  'Gujranwala',
  'Sialkot'
]

// Coordinates for real interactive Leaflet maps
export const CITY_COORDINATES = {
  Karachi: { lat: 24.8607, lng: 67.0011, zoom: 12 },
  Lahore: { lat: 31.5204, lng: 74.3587, zoom: 12 },
  Islamabad: { lat: 33.6844, lng: 73.0479, zoom: 12 },
  Faisalabad: { lat: 31.4504, lng: 73.1350, zoom: 12 },
  Multan: { lat: 30.1575, lng: 71.5249, zoom: 12 },
  Rawalpindi: { lat: 33.5973, lng: 73.0479, zoom: 12 },
  Peshawar: { lat: 34.0151, lng: 71.5249, zoom: 12 },
  Gujranwala: { lat: 32.1877, lng: 74.1945, zoom: 12 },
  Sialkot: { lat: 32.4945, lng: 74.5229, zoom: 12 }
}

// Popular areas per city for accurate location filtering
export const CITY_AREAS = {
  Karachi: ['All Areas', 'Clifton', 'DHA Karachi', 'Gulshan-e-Iqbal', 'Saddar', 'North Nazimabad', 'Bahadurabad', 'PECHS', 'Gulistan-e-Johar', 'Federal B Area', 'Korangi'],
  Lahore: ['All Areas', 'Gulberg', 'Johar Town', 'Model Town', 'Allama Iqbal Town', 'DHA Lahore', 'Faisal Town', 'Bahria Town', 'Wapda Town', 'Cantt'],
  Islamabad: ['All Areas', 'F-7', 'F-10', 'Blue Area', 'G-9', 'F-6', 'F-8', 'G-11', 'E-7', 'DHA Phase 2', 'Bahria Town Phase 4'],
  Faisalabad: ['All Areas', 'Civil Lines', 'Madina Town', 'D Ground', 'Peoples Colony', 'Gulberg', 'Kohinoor City'],
  Multan: ['All Areas', 'Cantt', 'Gulgasht Colony', 'Bosan Road', 'Shah Rukn-e-Alam', 'Wapda Town'],
  Rawalpindi: ['All Areas', 'Saddar', 'Bahria Town', 'Chaklala Scheme 3', 'Satellite Town', 'Westridge'],
  Peshawar: ['All Areas', 'Hayatabad', 'University Town', 'Cantt', 'Gulbahar'],
  Gujranwala: ['All Areas', 'DC Colony', 'Model Town', 'Satellite Town', 'Wapda Town'],
  Sialkot: ['All Areas', 'Cantt', 'Model Town', 'Kashmir Road', 'Ugoki']
}

// Dedicated single source of truth for all services with authentic photo mapping
export const SERVICES_CONFIG = [
  {
    id: 'electrician',
    name: 'Electricians',
    searchKey: 'Electrician',
    iconName: 'Zap',
    image: '/assets/images/electrician_work.jpg',
    startingPrice: 500,
    description: 'Wiring, short circuits, breaker panels, ceiling fans, UPS & solar repair.',
    popular: true
  },
  {
    id: 'plumber',
    name: 'Plumbers',
    searchKey: 'Plumber',
    iconName: 'Wrench',
    image: '/assets/images/plumber_sink.jpg',
    startingPrice: 600,
    description: 'Leakages, pipe fittings, sanitary installation, water pump & geyser repair.',
    popular: true
  },
  {
    id: 'ac_cooling',
    name: 'AC & Cooling',
    searchKey: 'AC Repair',
    iconName: 'Snowflake',
    image: '/assets/images/ac_technician.jpg',
    startingPrice: 800,
    description: 'AC general servicing, gas refill, installation, leak repair & compressor fix.',
    popular: true
  },
  {
    id: 'home_repair',
    name: 'Home Repair',
    searchKey: 'General Repair',
    iconName: 'Home',
    image: '/assets/images/handyman_service.jpg',
    startingPrice: 500,
    description: 'Complete home maintenance, drywall, fixture mounting & general repairs.',
    popular: true
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    searchKey: 'Cleaner',
    iconName: 'Sparkles',
    image: '/assets/images/cleaning_service.jpg',
    startingPrice: 500,
    description: 'Deep residential cleaning, sofa shampoo, kitchen, washroom & water tank wash.',
    popular: true
  },
  {
    id: 'carpenter',
    name: 'Carpentry',
    searchKey: 'Carpenter',
    iconName: 'Hammer',
    image: '/assets/images/carpenter_work.jpg',
    startingPrice: 700,
    description: 'Door locks, customized cabinets, wooden partitions & furniture repair.',
    popular: true
  },
  {
    id: 'painter',
    name: 'Painting',
    searchKey: 'Painter',
    iconName: 'Paintbrush',
    image: '/assets/images/painter_work.jpg',
    startingPrice: 1500,
    description: 'Interior & exterior wall painting, weather sheet, polish & wall putty finish.',
    popular: true
  },
  {
    id: 'auto_service',
    name: 'Auto Services',
    searchKey: 'Auto Services',
    iconName: 'Car',
    image: '/assets/images/auto_service.jpg',
    startingPrice: 800,
    description: 'Mechanics, oil change, battery jumpstart, brake service & car diagnostics.',
    popular: true
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    searchKey: 'Appliance Repair',
    iconName: 'Tv',
    image: '/assets/images/appliance_repair.jpg',
    startingPrice: 600,
    description: 'Washing machines, microwave ovens, water geysers, and refrigerators.',
    popular: false
  },
  {
    id: 'cctv',
    name: 'CCTV Installation',
    searchKey: 'CCTV Installation',
    iconName: 'Video',
    image: '/assets/images/cctv_service.jpg',
    startingPrice: 1000,
    description: 'Security camera setup, DVR configuration, cabling & mobile app live streaming.',
    popular: false
  },
  {
    id: 'locksmith',
    name: 'Locksmith',
    searchKey: 'Locksmith',
    iconName: 'Key',
    image: '/assets/images/locksmith_service.jpg',
    startingPrice: 500,
    description: 'Emergency lock opening, key duplication, deadbolt repair & digital locks.',
    popular: false
  },
  {
    id: 'beauty',
    name: 'Beauty & Salon',
    searchKey: 'Beauty',
    iconName: 'Smile',
    image: '/assets/images/beauty_salon.jpg',
    startingPrice: 600,
    description: 'Professional salon services, styling, haircut, manicure & home grooming.',
    popular: false
  }
]

export const SERVICES = SERVICES_CONFIG.map(s => s.searchKey)
