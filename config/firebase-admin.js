const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');

// Initialize Firebase Admin SDK with service account key
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

// Ensure we only initialize once (important in hot-reload environments)
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

// Export admin auth for use in middleware
module.exports = { getAuth };
