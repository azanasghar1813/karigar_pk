const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from backend/.env
const envPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

const Listing = require('../models/Listing');

/**
 * Robust RFC-4180 compliant CSV parser
 * Handles quoted fields, embedded commas, and escaped quotes ("")
 */
function parseCSV(text) {
  const lines = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
        i++;
        continue;
      }
    }

    if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
      i++;
      continue;
    }

    if ((char === '\r' || char === '\n') && !inQuotes) {
      row.push(current.trim());
      current = '';
      if (row.length > 0 && row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      if (char === '\r' && nextChar === '\n') {
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    current += char;
    i++;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.length > 0 && row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }

  if (lines.length === 0) return [];

  // Parse header line
  const headers = lines[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const records = [];

  for (let r = 1; r < lines.length; r++) {
    const values = lines[r];
    const record = {};
    for (let h = 0; h < headers.length; h++) {
      record[headers[h]] = values[h] !== undefined ? values[h] : '';
    }
    records.push(record);
  }

  return records;
}

/**
 * Main import function
 */
async function runImport() {
  const args = process.argv.slice(2);
  let csvPath = null;
  let targetCity = null;
  let sampleLimit = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--city' && args[i + 1]) {
      targetCity = args[i + 1];
      i++;
    } else if (arg === '--file' && args[i + 1]) {
      csvPath = args[i + 1];
      i++;
    } else if (arg === '--sample' && args[i + 1]) {
      sampleLimit = parseInt(args[i + 1], 10);
      i++;
    } else if (!arg.startsWith('--') && !csvPath) {
      csvPath = arg;
    }
  }

  if (!targetCity) {
    console.error('Error: --city argument is required (e.g. --city Lahore)');
    process.exit(1);
  }

  if (!csvPath) {
    console.error('Error: CSV file path is required as an argument or via --file <path>');
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: File not found at ${resolvedPath}`);
    process.exit(1);
  }

  console.log(`Starting import for city: ${targetCity}`);
  console.log(`Reading CSV from: ${resolvedPath}`);

  // Connect to Database
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in environment');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB successfully.');

  // Pre-load existing deduplication keys from database for this city
  console.log(`Loading existing database records for city: ${targetCity}...`);
  const existingListings = await Listing.find({
    city: new RegExp(`^${targetCity.trim()}$`, 'i')
  })
    .select('name service area phone city')
    .lean();

  const seenKeys = new Set();
  for (const item of existingListings) {
    const p = (item.phone || '').trim().toLowerCase();
    const s = (item.service || '').trim().toLowerCase();
    const a = (item.area || '').trim().toLowerCase();
    const c = targetCity.trim().toLowerCase();

    if (p) {
      seenKeys.add(`${p}|${s}|${a}|${c}`);
    } else {
      const n = (item.name || '').trim().toLowerCase();
      seenKeys.add(`${n}|${s}|${a}|${c}`);
    }
  }
  console.log(`Found ${seenKeys.size} existing deduplication keys in database for ${targetCity}.`);

  // Read and parse CSV
  const fileContent = fs.readFileSync(resolvedPath, 'utf8');
  let records = parseCSV(fileContent);

  if (sampleLimit && sampleLimit > 0) {
    console.log(`Running in SAMPLE mode: processing first ${sampleLimit} rows`);
    records = records.slice(0, sampleLimit);
  }

  let insertedCount = 0;
  let skippedDuplicatesCount = 0;
  let skippedInvalidCount = 0;

  const BATCH_SIZE = 500;
  let batch = [];

  for (const row of records) {
    const name = (row['Business Name'] || '').trim();
    const service = (row['Service'] || '').trim();
    const area = (row['Area'] || '').trim();
    const phone = (row['Phone'] || '').trim();
    const whatsapp = (row['WhatsApp'] || '').trim();
    const ratingRaw = (row['Rating'] || '').trim();
    const address = (row['Address'] || '').trim();
    const source = (row['Source'] || '').trim();
    const sourceUrl = (row['Source Link'] || '').trim();
    const notes = (row['Notes'] || '').trim();

    // Validation: name and service are mandatory
    if (!name || !service) {
      skippedInvalidCount++;
      continue;
    }

    // Deduplication key:
    // If phone exists: phone + service + area + city
    // If phone empty: name + service + area + city
    const p = phone.toLowerCase();
    const s = service.toLowerCase();
    const a = area.toLowerCase();
    const c = targetCity.trim().toLowerCase();

    const dedupeKey = p ? `${p}|${s}|${a}|${c}` : `${name.toLowerCase()}|${s}|${a}|${c}`;

    if (seenKeys.has(dedupeKey)) {
      skippedDuplicatesCount++;
      continue;
    }

    seenKeys.add(dedupeKey);

    let parsedRating = null;
    if (ratingRaw) {
      const num = parseFloat(ratingRaw);
      if (!isNaN(num) && num >= 0 && num <= 5) {
        parsedRating = num;
      }
    }

    batch.push({
      name,
      service,
      city: targetCity.trim(),
      area,
      address,
      phone,
      whatsapp,
      rating: parsedRating,
      source,
      sourceUrl,
      claimStatus: 'unclaimed',
      isActive: true,
      notes
    });

    if (batch.length >= BATCH_SIZE) {
      await Listing.insertMany(batch, { ordered: false });
      insertedCount += batch.length;
      batch = [];
      process.stdout.write(`\rProgress: ${insertedCount} inserted...`);
    }
  }

  if (batch.length > 0) {
    await Listing.insertMany(batch, { ordered: false });
    insertedCount += batch.length;
  }

  console.log('\n\n================ IMPORT SUMMARY ================');
  console.log(`City:               ${targetCity}`);
  console.log(`File:               ${path.basename(resolvedPath)}`);
  console.log(`Total Rows Read:    ${records.length}`);
  console.log(`Inserted:           ${insertedCount}`);
  console.log(`Skipped Duplicates: ${skippedDuplicatesCount}`);
  console.log(`Skipped Invalid:    ${skippedInvalidCount}`);
  console.log('================================================\n');

  await mongoose.disconnect();
  console.log('MongoDB connection closed.');

  return {
    city: targetCity,
    file: path.basename(resolvedPath),
    total: records.length,
    inserted: insertedCount,
    skippedDuplicates: skippedDuplicatesCount,
    skippedInvalid: skippedInvalidCount
  };
}

if (require.main === module) {
  runImport()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Import process failed with error:', err);
      process.exit(1);
    });
}

module.exports = { runImport };
