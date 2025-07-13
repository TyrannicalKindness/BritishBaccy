# Firebase Setup Guide for BritishBaccy

## 🔑 Your Firebase API Key
**Client-side API Key:** `AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA`

## 🚀 Quick Setup Steps

### Step 1: Complete Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Find your project (the one with API key: AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA)
3. Enable **Authentication** and **Firestore Database**

### Step 2: Get Your Complete Config
In Firebase Console > Project Settings > General tab, find your config object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID", 
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Get Service Account Key (for Backend)
1. Go to Project Settings > **Service Accounts** tab
2. Click **"Generate new private key"**
3. Download the JSON file
4. Save it as `firebase-service-account.json` in your project root

### Step 4: Update Your Files

#### A. Update `firebase-config.js`:
Replace the placeholder values with your actual config from Step 2.

#### B. Update `server.js`:
Find this section around line 35:
```javascript
/*
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json');
```

Replace it with:
```javascript
/*
// FIREBASE SETUP - Your API key: AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
```

#### C. Uncomment Firebase Code:
Remove the `/*` and `*/` around the Firebase sections in server.js to activate them.

### Step 5: Update Frontend (Optional)
If you want to use Firebase Auth directly in the frontend instead of your custom backend:

Add to `britishbaccy-singlefileORIG.html` before `</head>`:
```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>
```

## 🧪 Test Your Setup

### Test Backend Connection:
```bash
npm start
```
Look for Firebase connection messages in the console.

### Test Registration:
1. Open your website
2. Try registering a new account
3. Check Firebase Console > Authentication to see if user was created
4. Check Firestore to see if user data was saved

## 🔧 Troubleshooting

### Common Issues:

**"Service account key not found"**
- Make sure `firebase-service-account.json` is in your project root
- Check the file name matches exactly

**"Permission denied"**
- Make sure Firestore rules allow read/write
- In Firebase Console > Firestore > Rules, use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**"Project ID not found"**
- Replace `YOUR_PROJECT_ID` with your actual Firebase project ID
- Find it in Firebase Console > Project Settings

## 📞 Need Help?

If you get stuck:
1. Check the Firebase Console for error messages
2. Look at your browser's developer console
3. Check the server console for Firebase connection logs
4. Email: BritishBaccy@gmail.com

---

**Your API key is already configured!** Just follow the steps above to complete the Firebase integration.
