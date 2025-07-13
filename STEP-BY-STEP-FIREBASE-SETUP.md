# 🔥 Step-by-Step Firebase Setup Guide

## 📋 What We're Going to Do
1. Go to Firebase Console
2. Find your project
3. Enable Authentication and Firestore
4. Get your service account key
5. Update your code
6. Test everything

---

## 🌐 Step 1: Go to Firebase Console

1. **Open your web browser**
2. **Go to**: https://console.firebase.google.com/
3. **Sign in** with your Google account (the one you used to create the Firebase project)

---

## 🔍 Step 2: Find Your Project

1. **Look for your project** on the Firebase Console homepage
   - It should be listed under "Your Firebase projects"
   - The project name might be something like "My First Project" or similar
   - **How to identify it**: Click on each project and check if the API key matches yours: `AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA`

2. **If you can't find your project**:
   - Look for a project with API key: `AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA`
   - Or create a new project by clicking **"Add project"**

3. **Click on your project** to open it

---

## 🔐 Step 3: Enable Authentication

1. **In the left sidebar**, click **"Authentication"**
2. **Click "Get started"** (if you see this button)
3. **Click on the "Sign-in method" tab** at the top
4. **Click on "Email/Password"** in the list
5. **Toggle the switch to "Enable"** (first option - Email/Password)
6. **Click "Save"**

---

## 🗄️ Step 4: Enable Firestore Database

1. **In the left sidebar**, click **"Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in production mode"** 
4. **Click "Next"**
5. **Choose your location** (pick the closest to your users, like "europe-west" for UK)
6. **Click "Done"**
7. **Wait for the database to be created** (takes 1-2 minutes)
8. **Set up security rules**:
   - **Click on "Rules" tab** at the top
   - **Replace the default rules** with this production-ready code:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Orders can only be read/written by the user who owns them
       match /orders/{orderId} {
         allow read, write: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
       // Admin collection (restrict access)
       match /admin/{document} {
         allow read, write: if false; // No public access
       }
     }
   }
   ```
   - **Click "Publish"**

---

## 🔑 Step 5: Get Your Complete Project Information

1. **Click the gear icon** ⚙️ in the left sidebar (next to "Project Overview")
2. **Click "Project settings"**
3. **Scroll down to "Your apps"** section
4. **Look for the "Web app" section** or click "Add app" if none exists
5. **Copy these values** (write them down):
   ```
   Project ID: ________________
   Auth Domain: ________________
   Storage Bucket: ________________
   Messaging Sender ID: ________________
   App ID: ________________
   ```

---

## 🗝️ Step 6: Get Service Account Key (IMPORTANT!)

1. **Still in Project Settings**, click the **"Service accounts"** tab at the top
2. **Click "Generate new private key"** button
3. **Click "Generate key"** in the popup
4. **A JSON file will download** - this is your service account key!
5. **Save this file** in your project folder as `firebase-service-account.json`
   - **Important**: Put it in the same folder as your `server.js` file
   - **Rename it exactly**: `firebase-service-account.json`

---

## 💻 Step 7: Update Your Code Files

### A. Update `firebase-config.js`

1. **Open** `firebase-config.js` in your code editor
2. **Find this section**:
   ```javascript
   const firebaseClientConfig = {
     apiKey: "AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA",
     authDomain: "your-project-id.firebaseapp.com", // REPLACE
     projectId: "your-project-id", // REPLACE
     storageBucket: "your-project-id.appspot.com", // REPLACE
     messagingSenderId: "123456789", // REPLACE
     appId: "1:123456789:web:abcdef123456" // REPLACE
   };
   ```
3. **Replace the values** with the ones you copied in Step 5:
   - Replace `your-project-id` with your actual Project ID
   - Replace `123456789` with your Messaging Sender ID
   - Replace `1:123456789:web:abcdef123456` with your App ID

### B. Update `server.js`

1. **Open** `server.js` in your code editor
2. **Find this section** (around line 35):
   ```javascript
   /*
   const admin = require('firebase-admin');
   const serviceAccount = require('./path/to/your/serviceAccountKey.json');
   ```
3. **Replace it with**:
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./firebase-service-account.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com"
   });

   const db = admin.firestore();
   ```
4. **Replace `YOUR-PROJECT-ID`** with your actual project ID from Step 5
5. **Remove the `/*` at the beginning and `*/` at the end** to uncomment the code

---

## 🧪 Step 8: Test Your Setup

### A. Start Your Server
1. **Open Command Prompt/Terminal** in your project folder
2. **Run**: `npm start`
3. **Look for**: "Server running on port 3000" message
4. **Check for Firebase connection** messages (no errors)

### B. Test Registration
1. **Open your browser**
2. **Go to**: http://localhost:3000
3. **Click "Register"** in the navigation
4. **Fill out the form** with test data:
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Nickname: TestUser
5. **Click "Register"**
6. **You should see**: Success message

### C. Check Firebase Console
1. **Go back to Firebase Console**
2. **Click "Authentication"** in the left sidebar
3. **You should see your test user** in the users list
4. **Click "Firestore Database"**
5. **You should see a "users" collection** with your user data

---

## ✅ Success Checklist

- [ ] Firebase Console opened
- [ ] Project found and opened
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Project information copied
- [ ] Service account key downloaded and saved as `firebase-service-account.json`
- [ ] `firebase-config.js` updated with your project info
- [ ] `server.js` updated and uncommented
- [ ] Server starts without errors
- [ ] Registration test successful
- [ ] User appears in Firebase Console

---

## 🆘 If Something Goes Wrong

### "Project not found"
- Make sure you're signed in with the correct Google account
- Check if the API key matches: `AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA`

### "Service account key error"
- Make sure the file is named exactly: `firebase-service-account.json`
- Make sure it's in the same folder as `server.js`
- Make sure you downloaded the correct JSON file

### "Server won't start"
- Run `npm install` first
- Check if port 3000 is already in use
- Look at the error message in the terminal

### "Registration doesn't work"
- Check browser console for errors (F12 → Console tab)
- Make sure Firestore rules allow writes
- Check server terminal for error messages

---

## 📞 Need Help?

If you get stuck on any step:
1. **Take a screenshot** of what you're seeing
2. **Copy any error messages**
3. **Email**: BritishBaccy@gmail.com
4. **Include**: Which step you're on and what's not working

---

**🎉 Once you complete all steps, your registration system will be fully connected to Firebase and ready for production use!**
