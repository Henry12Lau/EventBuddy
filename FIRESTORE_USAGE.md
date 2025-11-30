# Firestore Integration Guide

Your EventBuddy app is now integrated with Firebase Firestore! Here's what has been set up:

## What's Changed

### 1. Event Service (`src/services/eventService.ts`)
Created Firestore service functions for:
- `fetchEvents()` - Retrieves all events from Firestore
- `createEvent()` - Adds a new event to Firestore
- `joinEventInFirestore()` - Updates event participants

### 2. Event Context (`src/context/EventContext.tsx`)
Updated to:
- Load events from Firestore on app start
- Save new events to Firestore
- Update participants in Firestore when joining events
- Include loading state and refresh functionality
- Fallback to mock data if Firestore fails

### 3. Screens Updated
- **CreateEventScreen**: Now saves events to Firestore (async)
- **EventDetailScreen**: Join event button now updates Firestore
- **EventsScreen**: Shows loading indicator while fetching data

## Firestore Database Structure

```
events (collection)
  └── {eventId} (document)
      ├── title: string
      ├── sport: string
      ├── date: string (YYYY-MM-DD)
      ├── time: string (HH:MM)
      ├── endTime: string (HH:MM)
      ├── location: string
      ├── maxParticipants: number
      ├── participants: string[] (array of user IDs)
      ├── creatorId: string
      └── createdAt: timestamp
```

## How to Seed Initial Data

To populate your Firestore database with sample events:

1. Import the seed function in your App.tsx or any screen:
```typescript
import { seedFirestoreData } from './src/services/seedData';
```

2. Call it once (you can add a button or call it on mount):
```typescript
// Example: Add a button in your app
<Button title="Seed Data" onPress={seedFirestoreData} />
```

3. Remove the seed call after running it once to avoid duplicates

## Firebase Console Setup

Make sure you've set up Firestore in your Firebase Console:

1. Go to Firebase Console → Your Project
2. Navigate to Firestore Database
3. Click "Create Database"
4. Choose "Start in test mode" (for development)
5. Select a location for your database

### Security Rules (for development)

For testing, you can use these rules (Firebase Console → Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

⚠️ **Important**: These rules allow anyone to read/write. Update them for production!

### Production Security Rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && 
                      resource.data.creatorId == request.auth.uid;
    }
  }
}
```

## Testing the Integration

1. Start your app: `npm start`
2. Create a new event - it will be saved to Firestore
3. Check Firebase Console → Firestore to see the new document
4. Join an event - the participants array will update in Firestore
5. Refresh the app - events will load from Firestore

## Error Handling

The app includes error handling:
- If Firestore fails to load, it falls back to mock data
- Create/join operations show error alerts if they fail
- All Firestore operations are wrapped in try-catch blocks

## Next Steps

1. **Add Authentication**: Replace hardcoded user ID ('1') with actual Firebase Auth
2. **Real-time Updates**: Use Firestore listeners for live data updates
3. **Add Messages**: Create a messages collection for event chat
4. **User Profiles**: Store user data in Firestore
5. **Update Security Rules**: Implement proper authentication-based rules

## Useful Commands

```bash
# Install Firebase CLI (if needed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore
```
