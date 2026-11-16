require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

// In-memory cache for queries to avoid repeated Nominatim requests
const geocodeCache = new Map();

// Known accurate fallback coordinates for major areas in Pakistan if Nominatim fails or times out
const KNOWN_AREA_COORDS = {
  // Lahore
  'johar town, lahore': { lat: 31.4626, lng: 74.2790 },
  'gulberg, lahore': { lat: 31.5120, lng: 74.3430 },
  'dha lahore, lahore': { lat: 31.4552, lng: 74.4087 },
  'model town, lahore': { lat: 31.4839, lng: 74.3217 },
  'faisal town, lahore': { lat: 31.4789, lng: 74.3040 },
  'garden town, lahore': { lat: 31.4988, lng: 74.3168 },
  'allama iqbal town, lahore': { lat: 31.5036, lng: 74.2825 },
  'township, lahore': { lat: 31.4468, lng: 74.3121 },
  'wapda town, lahore': { lat: 31.4320, lng: 74.2612 },
  'valencia town, lahore': { lat: 31.4072, lng: 74.2560 },
  'bahria town, lahore': { lat: 31.3654, lng: 74.1802 },
  'cavalry ground, lahore': { lat: 31.5050, lng: 74.3730 },
  'lahore cantt, lahore': { lat: 31.5200, lng: 74.3900 },
  'anarkali & mall road, lahore': { lat: 31.5670, lng: 74.3140 },
  'samnabaad, lahore': { lat: 31.5360, lng: 74.2980 },
  'green town, lahore': { lat: 31.4380, lng: 74.3020 },
  'ichhra, lahore': { lat: 31.5280, lng: 74.3190 },
  'muslim town, lahore': { lat: 31.5150, lng: 74.3180 },
  'shadbagh, lahore': { lat: 31.6020, lng: 74.3430 },
  'badami bagh, lahore': { lat: 31.5990, lng: 74.3280 },
  'baghbanpura, lahore': { lat: 31.5790, lng: 74.3820 },
  'mughalpura, lahore': { lat: 31.5650, lng: 74.3760 },
  'harbanspura, lahore': { lat: 31.5750, lng: 74.4250 },
  'dharampura, lahore': { lat: 31.5520, lng: 74.3630 },
  'chauburji, lahore': { lat: 31.5560, lng: 74.3050 },
  'gulshan-e-ravi, lahore': { lat: 31.5420, lng: 74.2810 },
  'krishan nagar, lahore': { lat: 31.5620, lng: 74.2980 },
  'sanda, lahore': { lat: 31.5680, lng: 74.2890 },
  'thokar niaz beg, lahore': { lat: 31.4680, lng: 74.2380 },
  'multan road, lahore': { lat: 31.4920, lng: 74.2600 },
  'bedian road, lahore': { lat: 31.4420, lng: 74.4480 },
  'raiwind road, lahore': { lat: 31.3980, lng: 74.2180 },
  'lake city, lahore': { lat: 31.3850, lng: 74.2380 },
  'khayaban-e-amin, lahore': { lat: 31.3820, lng: 74.2580 },
  'state life society, lahore': { lat: 31.4390, lng: 74.4020 },
  'askari, lahore': { lat: 31.5300, lng: 74.4200 },
  'paragon city, lahore': { lat: 31.5280, lng: 74.4600 },
  'nfc society, lahore': { lat: 31.4450, lng: 74.2300 },
  'lda avenue, lahore': { lat: 31.4120, lng: 74.2050 },
  'jubilee town, lahore': { lat: 31.4180, lng: 74.2150 },
  'eme society, lahore': { lat: 31.4520, lng: 74.2120 },
  'kot lakhpat, lahore': { lat: 31.4550, lng: 74.3450 },
  'pak arab housing, lahore': { lat: 31.4480, lng: 74.3620 },
  'shahdara, lahore': { lat: 31.6250, lng: 74.2850 },
  'sukh chayn gardens, lahore': { lat: 31.4280, lng: 74.1950 },
  'walled city (androon lahore), lahore': { lat: 31.5880, lng: 74.3150 },
  'airline society, lahore': { lat: 31.4490, lng: 74.2750 },
  'mozang, lahore': { lat: 31.5510, lng: 74.3160 },

  // Karachi
  'clifton, karachi': { lat: 24.8191, lng: 67.0262 },
  'saddar, karachi': { lat: 24.8606, lng: 67.0317 },
  'dha karachi, karachi': { lat: 24.8118, lng: 67.0682 },
  'gulshan-e-iqbal, karachi': { lat: 24.9180, lng: 67.0971 },
  'gulistan-e-johar, karachi': { lat: 24.9172, lng: 67.1420 },
  'north nazimabad, karachi': { lat: 24.9392, lng: 67.0381 },
  'nazimabad, karachi': { lat: 24.9150, lng: 67.0320 },
  'bahadurabad, karachi': { lat: 24.8827, lng: 67.0674 },
  'pechs, karachi': { lat: 24.8680, lng: 67.0650 },
  'tariq road, karachi': { lat: 24.8720, lng: 67.0620 },
  'federal b area, karachi': { lat: 24.9350, lng: 67.0720 },
  'buffer zone, karachi': { lat: 24.9620, lng: 67.0650 },
  'north karachi, karachi': { lat: 24.9820, lng: 67.0620 },
  'new karachi, karachi': { lat: 24.9980, lng: 67.0600 },
  'korangi, karachi': { lat: 24.8320, lng: 67.1350 },
  'korangi industrial area, karachi': { lat: 24.8210, lng: 67.1250 },
  'landhi, karachi': { lat: 24.8450, lng: 67.1950 },
  'malir cantt, karachi': { lat: 24.9320, lng: 67.1980 },
  'malir city & saudabad, karachi': { lat: 24.8980, lng: 67.1850 },
  'model colony, karachi': { lat: 24.9080, lng: 67.1750 },
  'shah faisal colony, karachi': { lat: 24.8820, lng: 67.1450 },
  'civil lines & frere town, karachi': { lat: 24.8450, lng: 67.0280 },
  'karachi cantt, karachi': { lat: 24.8510, lng: 67.0420 },
  'jamshed town, karachi': { lat: 24.8750, lng: 67.0550 },
  'gulberg town karachi, karachi': { lat: 24.9320, lng: 67.0680 },
  'liaquatabad, karachi': { lat: 24.9080, lng: 67.0450 },
  'scheme 33, karachi': { lat: 24.9750, lng: 67.1280 },
  'saadi town, karachi': { lat: 24.9620, lng: 67.1650 },
  'gulshan-e-maymar, karachi': { lat: 25.0120, lng: 67.1350 },
  'surjani town, karachi': { lat: 25.0350, lng: 67.0650 },
  'taiser town, karachi': { lat: 25.0480, lng: 67.1120 },
  'bahria town karachi, karachi': { lat: 25.0150, lng: 67.3250 },
  'dha city karachi, karachi': { lat: 25.0550, lng: 67.4520 },
  'steel town, karachi': { lat: 24.8620, lng: 67.3350 },
  'gulshan-e-hadeed, karachi': { lat: 24.8650, lng: 67.3550 },
  'port qasim & bin qasim, karachi': { lat: 24.7850, lng: 67.3450 },
  'shah latif town, karachi': { lat: 24.8850, lng: 67.2450 },
  'quaidabad, karachi': { lat: 24.8680, lng: 67.2050 },
  'ibrahim hyderi, karachi': { lat: 24.7920, lng: 67.1250 },
  'mehmoodabad & akhtar colony, karachi': { lat: 24.8480, lng: 67.0750 },
  'qayyumabad & defence view, karachi': { lat: 24.8320, lng: 67.0820 },
  'sindhi muslim society (smchs), karachi': { lat: 24.8650, lng: 67.0520 },
  'garden, karachi': { lat: 24.8780, lng: 67.0220 },
  'kharadar & mithadar, karachi': { lat: 24.8550, lng: 66.9980 },
  'lyari, karachi': { lat: 24.8720, lng: 67.0020 },
  'baldia town, karachi': { lat: 24.9250, lng: 66.9680 },
  'orangi town, karachi': { lat: 24.9520, lng: 66.9980 },
  'site area, karachi': { lat: 24.9050, lng: 67.0020 },
  'manghopir & metroville, karachi': { lat: 24.9850, lng: 67.0120 },
  'keamari, karachi': { lat: 24.8250, lng: 66.9850 },
  'mauripur & hawksbay, karachi': { lat: 24.8550, lng: 66.9250 },
  'ranchore line & soldier bazaar, karachi': { lat: 24.8680, lng: 67.0250 },
  'gulshan-e-jamal, karachi': { lat: 24.8920, lng: 67.1120 },
  'gadap town, karachi': { lat: 25.1250, lng: 67.1850 },

  // Islamabad
  'f-6, islamabad': { lat: 33.7294, lng: 73.0747 },
  'f-7, islamabad': { lat: 33.7204, lng: 73.0561 },
  'f-8, islamabad': { lat: 33.7112, lng: 73.0375 },
  'f-10, islamabad': { lat: 33.6925, lng: 73.0012 },
  'f-11, islamabad': { lat: 33.6830, lng: 72.9825 },
  'e-7, islamabad': { lat: 33.7310, lng: 73.0450 },
  'e-11, islamabad': { lat: 33.6990, lng: 72.9780 },
  'g-6, islamabad': { lat: 33.7120, lng: 73.0820 },
  'g-7, islamabad': { lat: 33.7020, lng: 73.0650 },
  'g-8, islamabad': { lat: 33.6920, lng: 73.0480 },
  'g-9, islamabad': { lat: 33.6908, lng: 73.0238 },
  'g-10, islamabad': { lat: 33.6820, lng: 73.0080 },
  'g-11, islamabad': { lat: 33.6720, lng: 72.9910 },
  'g-13, islamabad': { lat: 33.6510, lng: 72.9650 },
  'g-14, islamabad': { lat: 33.6410, lng: 72.9510 },
  'g-15, islamabad': { lat: 33.6310, lng: 72.9370 },
  'h-8, islamabad': { lat: 33.6780, lng: 73.0680 },
  'h-9, islamabad': { lat: 33.6680, lng: 73.0480 },
  'h-11, islamabad': { lat: 33.6480, lng: 73.0080 },
  'h-12, islamabad': { lat: 33.6420, lng: 72.9880 },
  'i-8, islamabad': { lat: 33.6680, lng: 73.0780 },
  'i-9, islamabad': { lat: 33.6580, lng: 73.0580 },
  'i-10, islamabad': { lat: 33.6480, lng: 73.0380 },
  'i-11, islamabad': { lat: 33.6380, lng: 73.0180 },
  'd-12, islamabad': { lat: 33.7380, lng: 72.9850 },
  'blue area, islamabad': { lat: 33.7128, lng: 73.0630 },
  'banigala, islamabad': { lat: 33.7150, lng: 73.1420 },
  'bhara kahu, islamabad': { lat: 33.7420, lng: 73.1750 },
  'chak shahzad & rawal town, islamabad': { lat: 33.6720, lng: 73.1320 },
  'tarlai, islamabad': { lat: 33.6420, lng: 73.1380 },
  'bahria town phase 1-6, islamabad': { lat: 33.5420, lng: 73.1080 },
  'bahria town phase 7-8, islamabad': { lat: 33.5180, lng: 73.0850 },
  'dha phase 2, islamabad': { lat: 33.5350, lng: 73.1550 },
  'pwd colony, islamabad': { lat: 33.5820, lng: 73.1420 },
  'pakistan town, islamabad': { lat: 33.5920, lng: 73.1380 },
  'korang town, islamabad': { lat: 33.5780, lng: 73.1320 },
  'soan gardens, islamabad': { lat: 33.5620, lng: 73.1480 },
  'media town, islamabad': { lat: 33.5750, lng: 73.1180 },
  'jinnah gardens, islamabad': { lat: 33.5680, lng: 73.1780 },
  'gulberg greens, islamabad': { lat: 33.6150, lng: 73.1250 },
  'b-17 multi gardens, islamabad': { lat: 33.6820, lng: 72.8250 },
  'top city & mumtaz city, islamabad': { lat: 33.5820, lng: 72.8650 }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pseudo-random offset based on string hash so listings in the same area spread naturally
function getDeterministicOffset(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 1000) / 1000 - 0.5) * 0.006; // +/- 0.003 deg (~300m)
  const lngOffset = ((Math.abs(hash >> 3) % 1000) / 1000 - 0.5) * 0.006;
  return { latOffset, lngOffset };
}

async function getCoordinatesForArea(area, city) {
  const normKey = `${(area || '').toLowerCase().trim()}, ${(city || '').toLowerCase().trim()}`;
  
  // 1. Check in-memory cache
  if (geocodeCache.has(normKey)) {
    return geocodeCache.get(normKey);
  }

  // 2. Check curated known coords table
  if (KNOWN_AREA_COORDS[normKey]) {
    const coords = KNOWN_AREA_COORDS[normKey];
    geocodeCache.set(normKey, coords);
    return coords;
  }

  // 3. Fallback to Nominatim live lookup
  try {
    const query = `${area}, ${city}, Pakistan`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KarigarPK-Directory/1.0 (karigarpk.live@gmail.com)' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        geocodeCache.set(normKey, coords);
        await sleep(1100);
        return coords;
      }
    }
  } catch (err) {
    // ignore
  }

  return null;
}

async function runGeocoding(targetPerCity = 600) {
  console.log('=====================================================');
  console.log('KarigarPK Real Listing Geocoding Engine');
  console.log(`Target: At least ${targetPerCity} listings per city (Lahore, Karachi, Islamabad)`);
  console.log('Constraint: ONLY listings with published addresses (address != "" && != "address not published")');
  console.log('Constraint: Never overwrite owner-set pins (claimStatus != "verified")');
  console.log('=====================================================\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.\n');

    const cities = ['Lahore', 'Karachi', 'Islamabad'];
    const summary = {};

    for (const city of cities) {
      console.log(`\n>>> Processing City: ${city} ...`);
      
      // Select listings meeting exact user criteria
      const listings = await Listing.find({
        city,
        isActive: true,
        claimStatus: { $ne: 'verified' },
        address: { $exists: true, $nin: ['', null, 'address not published'] },
        $or: [
          { coordinates: null },
          { 'coordinates.lat': null },
          { 'coordinates.lng': null }
        ]
      }).limit(targetPerCity);

      console.log(`Found ${listings.length} candidate listings for ${city}.`);

      let citySuccess = 0;
      let cityFailed = 0;

      for (let i = 0; i < listings.length; i++) {
        const item = listings[i];
        const baseCoords = await getCoordinatesForArea(item.area, item.city);

        if (baseCoords && !isNaN(baseCoords.lat) && !isNaN(baseCoords.lng)) {
          // Apply realistic deterministic neighborhood jitter so pins don't overlap exactly
          const { latOffset, lngOffset } = getDeterministicOffset(item._id.toString() + item.name);
          const finalLat = parseFloat((baseCoords.lat + latOffset).toFixed(6));
          const finalLng = parseFloat((baseCoords.lng + lngOffset).toFixed(6));

          item.coordinates = {
            lat: finalLat,
            lng: finalLng
          };
          await item.save();
          citySuccess++;
        } else {
          cityFailed++;
        }

        if ((i + 1) % 100 === 0 || i === listings.length - 1) {
          console.log(`[${city}] Processed ${i + 1}/${listings.length} (Success: ${citySuccess}, Failed: ${cityFailed})`);
        }
      }

      summary[city] = {
        processed: listings.length,
        geocoded: citySuccess,
        failed: cityFailed
      };
    }

    console.log('\n=====================================================');
    console.log('GEOCODING SUMMARY REPORT:');
    for (const city of cities) {
      console.log(`- ${city}: Geocoded ${summary[city].geocoded} / ${summary[city].processed} listings (Failed: ${summary[city].failed})`);
    }
    console.log('=====================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Fatal Geocoding Error:', err);
    process.exit(1);
  }
}

runGeocoding(600);
