# Production Database Setup Guide

## Overview

You currently have a DEV database. Now you need to create a separate PROD (production) database for your live app.

---

## Step 1: Create Production Firebase Project

### 1.1 Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**

### 1.2 Create Project

```
Project name: eventbuddy-prod (or eventbuddy-production)
```

1. Enter project name
2. Click **Continue**
3. **Google Analytics**: Optional (recommended for production)
4. Click **Create project**
5. Wait for project to be created
6. Click **Continue**

---

## Step 2: Set Up Firestore Database

### 2.1 Enable Firestore

1. In your new **eventbuddy-prod** project
2. Click **Firestore Database** in left menu
3. Click **"Create database"**

### 2.2 Choose Location

```
Location: Choose closest to your users
- asia-east1 (Taiwan)
- asia-southeast1 (Singapore)
- us-central1 (Iowa)
- europe-west1 (Belgium)
```

**Important:** Location cannot be changed later!

### 2.3 Security Rules

Start in **production mode** (recommended):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default: Deny all reads and writes
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if true; // Anyone can read user profiles
      allow create: if true; // Anyone can create their profile
      allow update: if request.resource.data.id == userId; // Users can update their own profile
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true; // Anyone can read events
      allow create: if true; // Anyone can create events
      allow update: if true; // Anyone can update events (adjust as needed)
      allow delete: if true; // Anyone can delete events (adjust as needed)
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if true; // Anyone can read messages
      allow create: if true; // Anyone can create messages
      allow delete: if false; // No one can delete messages
    }
  }
}
```

Click **Next** → **Enable**

---

## Step 3: Create Firestore Indexes

### 3.1 Messages Index (Required for Chat)

1. Go to **Firestore Database** → **Indexes** tab
2. Click **"Create Index"**
3. Fill in:

```
Collection ID: messages
Fields to index:
  - Field: eventId
    Order: Ascending
  - Field: timestamp
    Order: Ascending
Query scope: Collection
```

4. Click **Create**
5. Wait for index to build (1-2 minutes)

---

## Step 4: Get Firebase Configuration

### 4.1 Add Web App

1. In Firebase Console, click **⚙️ Settings** (gear icon)
2. Click **Project settings**
3. Scroll down to **"Your apps"** section
4. Click **Web** icon `</>`
5. Register app:
   - App nickname: `EventBuddy Web`
   - Click **Register app**

### 4.2 Copy Configuration

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "eventbuddy-prod.firebaseapp.com",
  projectId: "eventbuddy-prod",
  storageBucket: "eventbuddy-prod.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Copy these values!**

---

## Step 5: Update .env File

### 5.1 Open Your .env File

Add the PROD credentials:

```bash
# Environment Configuration
EXPO_PUBLIC_ENV=development

# Firebase Development Configuration (existing)
EXPO_PUBLIC_FIREBASE_DEV_API_KEY=AIzaSyAbfYp3xOGb3UQLiubgrm_sczLnGddSyxw
EXPO_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN=eventbuddy-dev-26ce8.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DEV_PROJECT_ID=eventbuddy-dev-26ce8
EXPO_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET=eventbuddy-dev-26ce8.firebasestorage.app
EXPO_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID=1037752706570
EXPO_PUBLIC_FIREBASE_DEV_APP_ID=1:1037752706570:web:de29e47ec4e74cd9d861f3

# Firebase Production Configuration (NEW - add your PROD values here)
EXPO_PUBLIC_FIREBASE_PROD_API_KEY=your_prod_api_key_here
EXPO_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN=eventbuddy-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROD_PROJECT_ID=eventbuddy-prod
EXPO_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET=eventbuddy-prod.appspot.com
EXPO_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID=your_prod_sender_id
EXPO_PUBLIC_FIREBASE_PROD_APP_ID=your_prod_app_id
```

### 5.2 Replace Placeholders

Replace `your_prod_*` with actual values from Step 4.2

---

## Step 6: Test Production Database

### 6.1 Switch to Production Mode

In your `.env` file, change:

```bash
EXPO_PUBLIC_ENV=production
```

### 6.2 Restart App

```bash
# Stop current server (Ctrl+C)
# Clear cache and restart
npm start -- --clear
```

### 6.3 Check Console Logs

You should see:

```
🔥 Firebase Environment: PROD
✅ Firebase PROD config loaded: eventbuddy-prod
```

### 6.4 Test the App

1. Open app
2. Go through onboarding (creates user in PROD)
3. Create an event (saves to PROD)
4. Check Firebase Console → Firestore → Should see data in PROD database

---

## Step 7: Initialize Production Collections

### 7.1 Using Database Migration Tool

1. Make sure you're in PROD mode (`EXPO_PUBLIC_ENV=production`)
2. Open app
3. Go to Profile (as admin)
4. Tap **"🔧 Database Migration"**
5. Tap **"🔧 Initialize Collections"**
6. This creates the collections in PROD

### 7.2 Verify in Firebase Console

Check that these collections exist:
- ✅ `events`
- ✅ `users`
- ✅ `messages`

---

## Step 8: Switch Back to Development

### 8.1 Update .env

```bash
EXPO_PUBLIC_ENV=development
```

### 8.2 Restart App

```bash
npm start -- --clear
```

Now you're back to DEV database for development work!

---

## Environment Management

### Development (DEV)

```bash
# .env
EXPO_PUBLIC_ENV=development
```

- Use for: Testing, development, debugging
- Database: eventbuddy-dev-26ce8
- Safe to: Reset data, test features, break things

### Production (PROD)

```bash
# .env
EXPO_PUBLIC_ENV=production
```

- Use for: Live app, real users
- Database: eventbuddy-prod
- Be careful: Real user data, don't break things!

---

## Quick Reference

### Check Current Environment

Look at console logs when app starts:

```
🔥 Firebase Environment: DEV  ← Development
🔥 Firebase Environment: PROD ← Production
```

### Switch Environment

1. Edit `.env` file
2. Change `EXPO_PUBLIC_ENV` value
3. Restart app with `npm start -- --clear`

### Database Locations

```
DEV:  https://console.firebase.google.com/project/eventbuddy-dev-26ce8
PROD: https://console.firebase.google.com/project/eventbuddy-prod
```

---

## Security Checklist

### Before Going Live

- [ ] Production Firestore rules are set
- [ ] Indexes are created (messages index)
- [ ] Test user creation in PROD
- [ ] Test event creation in PROD
- [ ] Test chat in PROD
- [ ] Verify admin access works
- [ ] Set up Firebase Authentication (optional but recommended)
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up backup schedule
- [ ] Document admin user IDs

---

## Backup Strategy

### Manual Backup

1. Go to Firebase Console → Firestore
2. Click **"Import/Export"** tab
3. Click **"Export"**
4. Choose collections to export
5. Save to Cloud Storage

### Automated Backup (Recommended)

Set up scheduled exports:
1. Firebase Console → Firestore → Import/Export
2. Set up Cloud Scheduler
3. Schedule daily/weekly exports

---

## Troubleshooting

### Can't See PROD Data

**Problem:** App shows empty, no data in PROD

**Solution:**
1. Check `.env` has `EXPO_PUBLIC_ENV=production`
2. Verify PROD credentials are correct
3. Restart app with `--clear` flag
4. Check console logs for environment

### Wrong Database

**Problem:** Changes going to wrong database

**Solution:**
1. Check console logs for environment
2. Verify `.env` file
3. Restart app completely
4. Check Firebase Console to confirm

### Index Missing

**Problem:** Chat not working in PROD

**Solution:**
1. Go to PROD Firebase Console
2. Firestore → Indexes
3. Create messages index (see Step 3.1)
4. Wait for index to build

---

## Summary

✅ **Create PROD Firebase project**
✅ **Enable Firestore with production rules**
✅ **Create required indexes**
✅ **Get PROD configuration**
✅ **Update .env with PROD credentials**
✅ **Test PROD database**
✅ **Initialize collections**
✅ **Switch back to DEV for development**

Now you have separate DEV and PROD databases! 🎉

---

## Next Steps

1. **Development**: Keep using DEV database
2. **Testing**: Switch to PROD to test
3. **Deployment**: Build app with PROD environment
4. **Monitoring**: Check Firebase Console regularly
5. **Backups**: Set up automated backups

Your production database is ready! 🚀
