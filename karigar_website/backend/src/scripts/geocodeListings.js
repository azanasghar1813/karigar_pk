require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

// In-memory cache for geocoded queries
const geocodeCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodeAddress(queryString) {
  if (geocodeCache.has(queryString)) {
    return { ...geocodeCache.get(queryString), cached: true };
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryString)}&limit=1`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KarigarPK-Directory/1.0 (karigarpk.live@gmail.com)'
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      geocodeCache.set(queryString, result);
      return { ...result, cached: false };
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function runGeocoding(maxItems = 30) {
  console.log('--- KarigarPK Listing Geocoding Engine ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find listings missing coordinates that are NOT verified claims (never overwrite owner-set pins)
    const candidates = await Listing.find({
      isActive: true,
      claimStatus: { $ne: 'verified' },
      $or: [
        { coordinates: null },
        { 'coordinates.lat': null },
        { 'coordinates.lng': null }
      ]
    }).limit(maxItems);

    console.log(`Found ${candidates.length} candidate listing(s) to process (batch limit: ${maxItems}).\n`);

    let successCount = 0;
    let cachedCount = 0;
    let failureCount = 0;

    for (let i = 0; i < candidates.length; i++) {
      const listing = candidates[i];
      const addressPart = listing.address?.trim() || '';
      const areaPart = listing.area?.trim() || '';
      const cityPart = listing.city?.trim() || 'Lahore';

      // Construct search query
      const queryParts = [addressPart, areaPart, cityPart, 'Pakistan'].filter(Boolean);
      const query = queryParts.join(', ');

      const coords = await geocodeAddress(query);

      if (coords && !isNaN(coords.lat) && !isNaN(coords.lng)) {
        listing.coordinates = { lat: coords.lat, lng: coords.lng };
        await listing.save();
        if (coords.cached) {
          cachedCount++;
          console.log(`[${i + 1}/${candidates.length}] (CACHED) "${listing.name}" -> ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        } else {
          successCount++;
          console.log(`[${i + 1}/${candidates.length}] (OK) "${listing.name}" -> ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
          // Adhere to OpenStreetMap Nominatim 1 request per second rule
          await sleep(1100);
        }
      } else {
        failureCount++;
        console.log(`[${i + 1}/${candidates.length}] (SKIP) "${listing.name}" -> no match for "${query}"`);
        await sleep(1100);
      }
    }

    console.log('\n========================================');
    console.log('Geocoding Summary:');
    console.log(`- Total Processed: ${candidates.length}`);
    console.log(`- Successfully Geocoded: ${successCount}`);
    console.log(`- Cache Hits: ${cachedCount}`);
    console.log(`- Skipped / No Result: ${failureCount}`);
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Geocoding error:', error);
    process.exit(1);
  }
}

// Read optional CLI arg for batch size e.g. `node geocodeListings.js 20`
const argBatch = process.argv[2] ? parseInt(process.argv[2], 10) : 10;
runGeocoding(isNaN(argBatch) ? 10 : argBatch);
