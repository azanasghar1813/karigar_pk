require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cleanly construct the full address query without redundant duplicate words
function buildAddressQuery(address, area, city) {
  let addr = (address || '').trim().replace(/,\s*$/, '');
  const addrLower = addr.toLowerCase();
  const areaClean = (area || '').trim();
  const cityClean = (city || '').trim();

  const parts = [addr];
  if (areaClean && !addrLower.includes(areaClean.toLowerCase())) {
    parts.push(areaClean);
  }
  if (cityClean && !addrLower.includes(cityClean.toLowerCase())) {
    parts.push(cityClean);
  }
  if (!addrLower.includes('pakistan')) {
    parts.push('Pakistan');
  }
  return parts.join(', ');
}

async function geocodeAddressWithNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KarigarPK-Directory/1.0 (contact@karigarpk.live)',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
      return {
        lat: parseFloat(parseFloat(data[0].lat).toFixed(6)),
        lng: parseFloat(parseFloat(data[0].lon).toFixed(6)),
        displayName: data[0].display_name
      };
    }
  } catch (err) {
    console.warn(`[Nominatim Error] "${query}": ${err.message}`);
  }
  return null;
}

async function runGeocoding() {
  console.log('================================================================');
  console.log('KarigarPK Authentic Address Geocoding Engine');
  console.log('Method: OpenStreetMap Nominatim on FULL Address only');
  console.log('Strict Rate Limit: 1 request / second');
  console.log('Rule: NO area-centre offsets, NO fake data, SKIP if unresolved');
  console.log('================================================================\n');

  // Support customizable batch size via CLI flag, default to 50 listings per city
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const targetPerCity = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.\n');

    // STEP 1: RESET PREVIOUS OFFSET/ESTIMATED COORDINATES
    console.log('>>> Step 1: Resetting previously offset-geocoded listings...');
    const resetResult = await Listing.updateMany(
      {
        claimStatus: { $ne: 'verified' },
        'coordinates.lat': { $ne: null }
      },
      {
        $set: {
          'coordinates.lat': null,
          'coordinates.lng': null
        }
      }
    );
    console.log(`Successfully reset ${resetResult.modifiedCount} listings to null coordinates.`);
    console.log('Owner-set/verified claim pins were strictly untouched.\n');

    // STEP 2: GEOCODE AUTHENTIC ADDRESSES CITY BY CITY
    const cities = ['Lahore', 'Karachi', 'Islamabad'];
    const summary = {};

    for (const city of cities) {
      console.log(`>>> Step 2: Processing City: ${city} (Batch: ${targetPerCity}) ...`);

      const candidates = await Listing.find({
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

      console.log(`Found ${candidates.length} candidate listings with published addresses in ${city}.`);

      let cityGeocoded = 0;
      let citySkipped = 0;

      for (let i = 0; i < candidates.length; i++) {
        const item = candidates[i];
        const query = buildAddressQuery(item.address, item.area, item.city);

        const result = await geocodeAddressWithNominatim(query);

        if (result && !isNaN(result.lat) && !isNaN(result.lng)) {
          item.coordinates = {
            lat: result.lat,
            lng: result.lng
          };
          await item.save();
          cityGeocoded++;
          console.log(`[${city} ${i + 1}/${candidates.length}] ✓ PLACED: "${item.name}" -> [${result.lat}, ${result.lng}]`);
        } else {
          // Strictly SKIP: Leave coordinates as null
          citySkipped++;
          console.log(`[${city} ${i + 1}/${candidates.length}] ✗ SKIPPED: "${item.name}" (Address could not be resolved on OSM)`);
        }

        // Strict 1 second rate limit between Nominatim requests
        await sleep(1050);
      }

      summary[city] = {
        totalInspected: candidates.length,
        geocoded: cityGeocoded,
        skipped: citySkipped
      };
      console.log(`Finished ${city}: ${cityGeocoded} geocoded, ${citySkipped} skipped.\n`);
    }

    // FINAL SUMMARY REPORT
    console.log('================================================================');
    console.log('GEOCODING SUMMARY REPORT (Authentic Nominatim Geocoding):');
    console.log(`Reset previous offset records: ${resetResult.modifiedCount}`);
    for (const city of cities) {
      console.log(`- ${city}:`);
      console.log(`    Inspected: ${summary[city].totalInspected}`);
      console.log(`    Successfully Geocoded (Real OSM): ${summary[city].geocoded}`);
      console.log(`    Skipped (Remained Null): ${summary[city].skipped}`);
    }
    const finalWithCoords = await Listing.countDocuments({ 'coordinates.lat': { $ne: null } });
    console.log(`Total listings with verified authentic coordinates in DB now: ${finalWithCoords}`);
    console.log('================================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Fatal Geocoding Error:', err);
    process.exit(1);
  }
}

runGeocoding();
