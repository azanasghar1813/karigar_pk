const admin = require('firebase-admin');
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // In production (e.g. on Render), load the JSON from an environment variable
  try {
    let accountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    // Check if the string might be Base64 encoded (doesn't start with '{')
    if (!accountStr.trim().startsWith('{')) {
      accountStr = Buffer.from(accountStr, 'base64').toString('utf8');
    }
    serviceAccount = JSON.parse(accountStr);
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable. Ensure it is valid JSON or a Base64-encoded JSON string.');
    throw error;
  }
} else {
  // In local development, load from the file (which is git-ignored)
  try {
    serviceAccount = require('./firebaseServiceAccount.json');
  } catch (error) {
    throw new Error('Could not find FIREBASE_SERVICE_ACCOUNT env variable (required for Render) or ./firebaseServiceAccount.json file (for local dev).');
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
