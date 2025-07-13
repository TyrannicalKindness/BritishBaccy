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
const serviceAccount = require('./firebase-service-account.json');

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
