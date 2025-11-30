# Firebase Setup Guide for EventBuddy

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **EventBuddy** (or your preferred name)
4. Disable Google Analytics (optional for now)
5. Click "Create project"

## Step 2: Register Your App

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Enter app nickname: **EventBuddy Web**
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object

## Step 3: Add Firebase Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Firebase credentials:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=eventbuddy-xxx.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=eventbuddy-xxx
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=eventbuddy-xxx.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **Important**: The `.env` file is already in `.gitignore` and won't be committed to Git

**Note**: Firebase config values are public identifiers (not secrets). Security is handled by Firebase Security Rules, not by hiding these values. However, it's still best practice to use environment variables for configuration management.

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your preferred location (e.g., us-central)
5. Click "Enable"

### Security Rules (Test Mode - Update before production!)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 1, 1);
    }
  }
}
```

## Step 5: Set Up Authentication (Optional)

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable sign-in methods you want:
   - **Email/Password** (recommended for MVP)
   - Google
   - Facebook
   - etc.

## Step 6: Firestore Collections Structure

Your app will use these collections:

### `events` Collection
```
events/
  {eventId}/
    - title: string
    - sport: string (optional)
    - date: string
    - time: string
    - endTime: string
    - location: string
    - maxParticipants: number
    - participants: array of user IDs
    - creatorId: string
    - createdAt: timestamp
```

### `users` Collection (Future)
```
users/
  {userId}/
    - name: string
    - email: string
    - sports: array
    - createdAt: timestamp
```

## Step 7: Test Your Setup

After adding your Firebase config, restart your app:
```bash
npm start
```

The app will now:
- ✅ Load events from Firestore
- ✅ Save new events to Firestore
- ✅ Sync in real-time across devices
- ✅ Persist data permanently

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Check that you copied the correct API key from Firebase Console

### Error: "Missing or insufficient permissions"
- Make sure Firestore is in test mode
- Check security rules in Firestore > Rules tab

### Events not showing up
- Check Firestore Console > Data tab to see if events are being saved
- Check browser console for errors

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Add configuration to `src/config/firebase.ts`
3. ✅ Enable Firestore Database
4. 🔄 App will automatically use Firebase for storage
5. 📱 (Optional) Set up Authentication for user accounts

## Production Checklist

Before launching:
- [ ] Update Firestore security rules
- [ ] Enable authentication
- [ ] Set up proper user permissions
- [ ] Add data validation rules
- [ ] Set up Firebase hosting (optional)
- [ ] Monitor usage in Firebase Console

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs)
