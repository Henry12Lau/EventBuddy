# Firestore Security Rules

## For Testing (Current Setup)

Use these rules while developing and testing your app:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all collections during testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning:** These rules allow anyone to read and write all data. Only use for development!

---

## For Production (Recommended)

Use these rules when deploying your app:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users Collection
    // - Anyone can read user profiles (to display names in events/chat)
    // - Users can only update their own profile
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events Collection
    // - Anyone can read events (public events)
    // - Authenticated users can create events
    // - Only creator can delete their event
    // - Anyone can update (for joining events)
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && 
                      resource.data.creatorId == request.auth.uid;
    }
    
    // Messages Collection (when implemented)
    // - Anyone can read messages (or restrict to event participants)
    // - Authenticated users can create messages
    // - Only message sender can update/delete their message
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **eventbuddy-5c0bd**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab
5. Paste the rules above
6. Click **Publish**

---

## Rule Explanations

### Users Collection Rules

```javascript
allow read: if true;
```
- Anyone can read user profiles
- Needed to display user names in events and chat

```javascript
allow create, update: if request.auth != null && request.auth.uid == userId;
```
- Only authenticated users can create/update profiles
- Users can only modify their own profile (userId must match auth.uid)

### Events Collection Rules

```javascript
allow read: if true;
```
- Anyone can browse events (public app)

```javascript
allow create: if request.auth != null;
```
- Only logged-in users can create events

```javascript
allow update: if request.auth != null;
```
- Any authenticated user can update events
- Needed for joining events (updating participants array)

```javascript
allow delete: if request.auth != null && resource.data.creatorId == request.auth.uid;
```
- Only the event creator can delete their event

---

## Testing Rules

You can test your rules in Firebase Console:

1. Go to **Firestore Database → Rules**
2. Click **Rules Playground** tab
3. Test different scenarios:
   - Unauthenticated read
   - User updating their own profile
   - User updating someone else's profile (should fail)

---

## Current vs Future

### Current (No Authentication Yet)
```javascript
// Simple test mode - allows everything
match /{document=**} {
  allow read, write: if true;
}
```

### After Adding Firebase Auth
```javascript
// Secure rules with authentication checks
match /users/{userId} {
  allow read: if true;
  allow write: if request.auth.uid == userId;
}
```

---

## Next Steps

1. **Now**: Use test mode rules (allow all)
2. **Before deploying**: Add Firebase Authentication
3. **After auth**: Switch to production rules
4. **Test**: Verify rules work correctly

---

## Common Issues

### "Missing or insufficient permissions"
- Check that rules are published
- Verify user is authenticated (if using auth rules)
- Check that userId matches auth.uid

### "Rules are too permissive"
- Firebase will warn you about test mode rules
- This is expected during development
- Switch to production rules before launching

### "Can't read user data"
- Make sure `allow read: if true;` is set for users
- Check that the document exists in Firestore
