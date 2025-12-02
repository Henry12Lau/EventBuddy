# Firebase Environment Setup Guide

## Overview

The app now supports separate Firebase projects for **Development** and **Production** environments.

## How It Works

The app automatically selects the correct Firebase project based on:
1. **`__DEV__`** flag (true when running with Expo dev server)
2. **`EXPO_PUBLIC_ENV`** environment variable (optional override)

### Environment Selection Logic

```
Development Mode:
- Running with `npm start` or `expo start`
- __DEV__ === true
- Uses FIREBASE_DEV_* credentials

Production Mode:
- Running production build
- __DEV__ === false
- Uses FIREBASE_PROD_* credentials
```

## Setup Steps

### 1. Create Two Firebase Projects

Go to [Firebase Console](https://console.firebase.google.com/) and create:

1. **Development Project** (e.g., `eventbuddy-dev`)
   - Used for testing and development
   - Can have relaxed security rules
   - Safe to reset/clear data

2. **Production Project** (e.g., `eventbuddy-prod`)
   - Used for live app
   - Strict security rules
   - Real user data

### 2. Get Firebase Credentials

For **each project**, go to:
- Firebase Console → Project Settings → General → Your apps
- Select your app (or create one)
- Copy the configuration values

### 3. Update Your .env File

Copy `.env.example` to `.env` and fill in both sets of credentials:

```bash
# Development Firebase Project
EXPO_PUBLIC_FIREBASE_DEV_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN=eventbuddy-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DEV_PROJECT_ID=eventbuddy-dev
EXPO_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET=eventbuddy-dev.appspot.com
EXPO_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_DEV_APP_ID=1:123456789:web:abc123

# Production Firebase Project
EXPO_PUBLIC_FIREBASE_PROD_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN=eventbuddy-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROD_PROJECT_ID=eventbuddy-prod
EXPO_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET=eventbuddy-prod.appspot.com
EXPO_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID=987654321
EXPO_PUBLIC_FIREBASE_PROD_APP_ID=1:987654321:web:xyz789
```

### 4. Set Up Firestore in Both Projects

For each Firebase project:

1. **Enable Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Choose location
   - Start in test mode (we'll add rules later)

2. **Create Collections**
   - `events` - for event data
   - `users` - for user profiles
   - `messages` - for chat messages

3. **Set Up Security Rules** (see FIRESTORE_SECURITY_RULES.md)

### 5. Verify Environment

When you run the app, check the console logs:

```
Development:
🔥 Firebase Environment: DEV
✅ Firebase DEV config loaded: eventbuddy-dev

Production:
🔥 Firebase Environment: PROD
✅ Firebase PROD config loaded: eventbuddy-prod
```

## Testing Different Environments

### Test Development Environment

```bash
# Start development server (uses DEV Firebase)
npm start
# or
expo start
```

### Test Production Environment

```bash
# Build production app (uses PROD Firebase)
eas build --platform android --profile production
# or
eas build --platform ios --profile production
```

### Force Environment (Optional)

You can override the environment by setting:

```bash
# Force development
EXPO_PUBLIC_ENV=development

# Force production
EXPO_PUBLIC_ENV=production
```

## Best Practices

### Development Environment
- ✅ Use for testing new features
- ✅ Seed with mock data
- ✅ Can reset/clear data anytime
- ✅ Relaxed security rules for testing
- ✅ Enable debug logging

### Production Environment
- ✅ Real user data only
- ✅ Strict security rules
- ✅ Regular backups
- ✅ Monitor usage and costs
- ✅ Disable debug logging

## Seed Data

The seed script will automatically use the correct environment:

```bash
# Seeds DEV database when running in development
npm run seed
```

## Troubleshooting

### Wrong Environment Being Used

Check:
1. Console logs show correct environment
2. `.env` file has correct credentials
3. Restart Expo dev server after changing `.env`

### Missing Configuration Error

```
❌ Missing Firebase DEV configuration keys: ['apiKey', 'projectId']
```

Solution:
1. Check `.env` file exists
2. Verify all `EXPO_PUBLIC_FIREBASE_DEV_*` variables are set
3. Restart Expo dev server

### Can't Connect to Firestore

1. Verify Firebase project exists
2. Check Firestore is enabled in Firebase Console
3. Verify security rules allow access
4. Check network connection

## Migration from Single Environment

If you're migrating from a single Firebase project:

1. Your existing `.env` credentials → Use for **PROD**
2. Create new Firebase project → Use for **DEV**
3. Copy data from PROD to DEV (optional):
   - Export from PROD Firestore
   - Import to DEV Firestore
   - Or use seed script for DEV

## Security Notes

- ✅ `.env` is in `.gitignore` (credentials not committed)
- ✅ Firebase credentials are public identifiers (safe to expose)
- ✅ Security is enforced by Firestore Security Rules
- ✅ Never commit real credentials to version control
- ✅ Use different credentials for DEV and PROD

## Files Modified

- ✅ `src/config/firebase.ts` - Environment-aware configuration
- ✅ `.env.example` - Template with DEV and PROD variables
- ✅ This guide - Setup instructions

## Next Steps

1. [ ] Create DEV Firebase project
2. [ ] Create PROD Firebase project
3. [ ] Update `.env` with both sets of credentials
4. [ ] Enable Firestore in both projects
5. [ ] Set up security rules in both projects
6. [ ] Test DEV environment
7. [ ] Seed DEV database
8. [ ] Test PROD environment (when ready to deploy)
