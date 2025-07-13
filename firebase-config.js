// Firebase Configuration for BritishBaccy
// This file contains both client-side and server-side Firebase setup

// ============================================================================
// CLIENT-SIDE FIREBASE CONFIG (for frontend use)
// ============================================================================
// Your provided API key: AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA
// Use this in your frontend JavaScript:

const firebaseClientConfig = {
  apiKey: "AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA",
  authDomain: "britishbaccy.firebaseapp.com",
  projectId: "britishbaccy",
  storageBucket: "britishbaccy.appspot.com",
  messagingSenderId: "181626144864",
  appId: "1:181626144864:web:40e72832b1617518abdb05"
};

// ============================================================================
// SERVER-SIDE FIREBASE ADMIN SETUP
// ============================================================================
// IMPORTANT: For server-side operations, you need a SERVICE ACCOUNT KEY
// 
// Steps to get your service account key:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project
// 3. Go to Project Settings (gear icon)
// 4. Go to "Service Accounts" tab
// 5. Click "Generate new private key"
// 6. Download the JSON file
// 7. Save it as 'firebase-service-account.json' in your project root
// 8. Uncomment the code below

const admin = require('firebase-admin');
// firebase-config.js
const firebase = require('firebase/app');
require('firebase/auth');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Export for use in server.js
module.exports = { auth, firebase };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://britishbaccy-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// Firebase helper functions
async function createFirebaseUser(userData) {
  try {
    const userRef = db.collection('users').doc();
    await userRef.set({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return userRef.id;
  } catch (error) {
    console.error('Error creating user in Firebase:', error);
    throw error;
  }
}

async function getFirebaseUserByEmail(email) {
  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting user from Firebase:', error);
    throw error;
  }
}

async function updateFirebaseUser(userId, updateData) {
  try {
    await db.collection('users').doc(userId).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user in Firebase:', error);
    throw error;
  }
}

module.exports = {
  firebaseClientConfig,
  admin,
  db,
  createFirebaseUser,
  getFirebaseUserByEmail,
  updateFirebaseUser
};
