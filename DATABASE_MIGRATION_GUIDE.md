# Database Migration Tool Guide

## Overview

The Database Migration screen helps you manage your Firestore database during development. It's only accessible in **DEV mode** from the Profile screen.

## Access the Tool

1. Go to **Profile** tab
2. Look for the green **"🔧 Database Migration"** button (only visible in development mode)
3. Tap to open the migration screen

## Features

### 1. 🔍 Check Database
- Shows current document counts for all collections
- Displays: events, users, messages
- Use this to verify your database state

**Example Output:**
```
🔍 Checking DEV database...
📊 events: 9 documents
📊 users: 1 documents
📊 messages: 0 documents
✅ Database check complete!
```

### 2. 🔧 Initialize Collections
- Verifies that all required collections exist
- Creates collections if they don't exist (Firestore auto-creates on first write)
- Safe to run multiple times

**Use Case:**
- First time setting up a new Firebase project
- Verifying database structure

### 3. 🌱 Seed Mock Data
- Adds sample events and users to your database
- Includes 9 events across different dates
- Creates 1 demo user

**Mock Data Includes:**
- Basketball, Yoga, Tennis, Soccer, Running, Boxing events
- Events on Nov 25, Dec 1, Dec 2, Dec 3
- Demo user: "Demo User" (demo@eventbuddy.com)

**Use Case:**
- Testing the app with realistic data
- Development and debugging
- Demo presentations

### 4. 🗑️ Clear All Data
- **⚠️ DANGEROUS:** Deletes ALL data from ALL collections
- Requires confirmation before proceeding
- Cannot be undone

**Use Case:**
- Resetting database to clean state
- Before reseeding with fresh data
- Cleaning up test data

## Typical Workflow

### First Time Setup (New Firebase Project)

```
1. Check Database → See it's empty
2. Initialize Collections → Verify structure
3. Seed Mock Data → Add sample data
4. Check Database → Verify data was added
```

### Reset Database

```
1. Clear All Data → Remove everything
2. Seed Mock Data → Add fresh data
```

### Verify Current State

```
1. Check Database → See current counts
```

## Safety Features

- ✅ Only available in **DEV mode** (`__DEV__`)
- ✅ Shows current environment (DEV/PROD) at top
- ✅ Confirmation dialogs for destructive operations
- ✅ Real-time status log shows all operations
- ✅ Cannot accidentally run in production

## Status Log

The screen shows a real-time log of all operations:

```
🔍 Checking DEV database...
📊 events: 9 documents
📊 users: 1 documents
📊 messages: 0 documents
✅ Database check complete!
```

This helps you:
- Track what's happening
- Debug issues
- Verify operations completed successfully

## Environment Indicator

The screen always shows which environment you're working with:

```
┌─────────────────────────────┐
│ Database Migration    [DEV] │
└─────────────────────────────┘
```

- **DEV** = Development database (safe to modify)
- **PROD** = Production database (should not appear in dev mode)

## Common Use Cases

### 1. Setting Up New Dev Environment

```bash
# After creating new Firebase DEV project
1. Update .env with DEV credentials
2. Restart app
3. Go to Profile → Database Migration
4. Run: Initialize Collections
5. Run: Seed Mock Data
6. Run: Check Database (verify 9 events, 1 user)
```

### 2. Testing Event Features

```bash
# Need fresh data for testing
1. Clear All Data
2. Seed Mock Data
3. Test your feature
```

### 3. Debugging Data Issues

```bash
# Something wrong with data
1. Check Database (see current state)
2. Clear All Data (if needed)
3. Seed Mock Data (get known good state)
```

### 4. Before Demo/Presentation

```bash
# Want clean, consistent data
1. Clear All Data
2. Seed Mock Data
3. Check Database (verify counts)
```

## Troubleshooting

### Button Not Showing

**Problem:** Can't see "Database Migration" button in Profile

**Solution:**
- Make sure you're running in development mode (`npm start`)
- Check that `__DEV__` is true
- Button only shows in dev mode for safety

### Permission Errors

**Problem:** "Permission denied" when running operations

**Solution:**
- Check Firestore Security Rules
- In development, you can use test mode rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // DEV ONLY!
    }
  }
}
```

### Wrong Environment

**Problem:** Shows "PROD" instead of "DEV"

**Solution:**
- Check your `.env` file has DEV credentials
- Verify `EXPO_PUBLIC_ENV=development`
- Restart Expo dev server
- Check console logs for Firebase environment

### Seed Data Not Appearing

**Problem:** Seeded data but events don't show

**Solution:**
1. Run "Check Database" to verify data was added
2. Check event dates (may be in past/future)
3. Verify you're looking at correct environment
4. Refresh the Events screen

## Best Practices

### DO ✅
- Use this tool frequently during development
- Clear and reseed data when testing new features
- Check database state before and after operations
- Keep DEV and PROD databases separate

### DON'T ❌
- Never use in production builds
- Don't seed production database with mock data
- Don't share DEV database credentials
- Don't rely on DEV data for important testing

## Mock Data Details

### Events (9 total)
- **Nov 25:** Football Match (past event)
- **Dec 1:** Morning Basketball, Yoga Class (FULL), Lunch Yoga, Evening Tennis
- **Dec 2:** Morning Run, Evening Soccer Match
- **Dec 3:** Tennis Practice, Boxing Training

### Users (1 total)
- **ID:** 1
- **Name:** Demo User
- **Email:** demo@eventbuddy.com

### Messages
- Empty by default (created when users chat)

## Related Documentation

- `FIREBASE_ENVIRONMENT_SETUP.md` - Setting up DEV/PROD environments
- `FIRESTORE_SECURITY_RULES.md` - Security rules configuration
- `EVENT_SCHEMA_MIGRATION.md` - Event schema changes

## Technical Details

### Collections Managed
- `events` - Event data
- `users` - User profiles
- `messages` - Chat messages

### Operations
- **Check:** `getDocs()` on each collection
- **Initialize:** Verifies collections exist (auto-created on write)
- **Seed:** `addDoc()` for events, `setDoc()` for users
- **Clear:** `deleteDoc()` for each document in collections

### Error Handling
- All operations wrapped in try-catch
- Errors displayed in status log
- User-friendly error messages
- Console logs for debugging
