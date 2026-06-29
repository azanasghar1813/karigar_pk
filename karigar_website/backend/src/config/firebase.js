const admin = require('firebase-admin');
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // In production (e.g. on Render), load the JSON from an environment variable
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable');
    throw error;
  }
} else {
  // In local development, load from the file (which is git-ignored)
  try {
    serviceAccount = require('./firebaseServiceAccount.json');
  } catch (error) {
    throw new Error('Could not find FIREBASE_SERVICE_ACCOUNT env variable or ./firebaseServiceAccount.json file.');
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
