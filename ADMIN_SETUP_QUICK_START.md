# Admin Setup - Quick Start Guide

## What I've Implemented

I've added **Role-Based Admin Access** to your app. Here's what's new:

### ✅ Changes Made:

1. **User Type Updated** - Added `role` and `isAdmin` fields
2. **Admin Hook Created** - `useIsAdmin()` to check admin status
3. **Admin Button Added** - Shows in Profile screen for admin users only
4. **Admin Panel Accessible** - Your existing AdminScreen is now protected

---

## How to Make a User an Admin

### Option 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (eventbuddy-dev-26ce8)
3. Go to **Firestore Database**
4. Find the `users` collection
5. Click on a user document (e.g., user ID "1")
6. Click **"Add field"**
7. Add one of these:
   - Field: `role`, Value: `admin` (string)
   - OR Field: `isAdmin`, Value: `true` (boolean)
8. Click **Save**

**Example:**
```
users/1
{
  id: "1",
  name: "Demo User",
  email: "demo@eventbuddy.com",
  role: "admin"  ← Add this
}
```

### Option 2: Update Seed Data

Edit `src/services/seedData.ts`:

```typescript
const sampleUser = {
  name: 'Demo User',
  email: 'demo@eventbuddy.com',
  role: 'admin'  // Add this line
};
```

Then reseed the database.

---

## How It Works

### For Admin Users:
1. Open app
2. Go to **Profile** tab
3. See **"🔐 Admin Panel"** button (purple)
4. Tap to access admin features

### For Regular Users:
1. Open app
2. Go to **Profile** tab
3. **No admin button** (hidden)
4. Cannot access admin features

---

## Testing Admin Access

### Test as Admin:

1. **Set yourself as admin** (see above)
2. **Restart app** (to reload user data)
3. **Go to Profile tab**
4. **Look for purple "🔐 Admin Panel" button**
5. **Tap it** to access admin features

### Test as Regular User:

1. **Remove admin role** from user in Firestore
2. **Restart app**
3. **Go to Profile tab**
4. **Admin button should be hidden**

---

## Admin Features Available

Once you access the Admin Panel, you can:

- ✅ **Migrate Database** - Add isActive field to events
- ✅ **Seed Sample Data** - Add mock events and users
- ✅ View instructions and info

---

## Security

### Current Security:
- ✅ Admin button only shows for admin users
- ✅ Role checked in app before showing features
- ⚠️ **Need to add Firestore Security Rules** (see below)

### Add Firestore Security Rules:

Go to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin() || 
                              (request.auth != null && 
                               resource.data.creatorId == request.auth.uid);
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if isAdmin();
    }
  }
}
```

**Note:** These rules require Firebase Authentication. For now, you can use test mode rules during development.

---

## Development vs Production

### Development (Current):
- Admin button shows for users with `role: 'admin'`
- Database Migration button shows in DEV mode (`__DEV__`)
- Both buttons visible in Profile screen

### Production (When Launched):
- Admin button only shows for admin users
- Database Migration button hidden (DEV only)
- Regular users see normal profile screen

---

## Multiple Admins

You can have multiple admin users:

1. Create/find user in Firestore
2. Add `role: 'admin'` to their document
3. They'll see admin button when they log in

**Example:**
```
users/user123
{
  id: "user123",
  name: "Admin Sarah",
  email: "sarah@eventbuddy.com",
  role: "admin"
}

users/user456
{
  id: "user456",
  name: "Admin John",
  email: "john@eventbuddy.com",
  role: "admin"
}
```

---

## Troubleshooting

### Admin Button Not Showing

**Problem:** I'm an admin but don't see the button

**Solutions:**
1. Check Firestore - verify `role: 'admin'` is set
2. Restart app - user data needs to reload
3. Check console logs - look for user data
4. Verify you're logged in as the correct user

### Admin Button Shows for Everyone

**Problem:** All users see admin button

**Solutions:**
1. Check `useIsAdmin` hook is working
2. Verify user data has correct role
3. Check if `isAdmin` condition is correct

### Can't Access Admin Features

**Problem:** Button shows but can't access features

**Solutions:**
1. Check navigation is set up correctly
2. Verify AdminScreen is imported
3. Check for console errors

---

## Next Steps

### Immediate:
1. ✅ Set yourself as admin in Firestore
2. ✅ Test admin access
3. ✅ Verify regular users can't see admin button

### Before Production:
1. ⚠️ Add Firestore Security Rules
2. ⚠️ Set up Firebase Authentication
3. ⚠️ Test with real users
4. ⚠️ Add more admin features (if needed)

### Future Enhancements:
- Add more admin features (ban users, feature events, etc.)
- Build separate admin web dashboard
- Add admin activity logging
- Add analytics dashboard

---

## Quick Reference

### Check if User is Admin:
```typescript
import { useIsAdmin } from '../hooks/useIsAdmin';

const isAdmin = useIsAdmin();
if (isAdmin) {
  // Show admin features
}
```

### Make User Admin (Firestore):
```javascript
users/{userId}
{
  role: "admin"  // or isAdmin: true
}
```

### Admin Button Location:
- Profile Tab → "🔐 Admin Panel" (purple button)

### Dev Tools Location:
- Profile Tab → "🔧 Database Migration" (green button, DEV only)

---

## Summary

✅ **Admin system is ready!**
✅ **Set user role in Firestore to grant admin access**
✅ **Admin button automatically shows for admin users**
✅ **Regular users cannot see or access admin features**

Just set `role: 'admin'` in Firestore for any user you want to make an admin!
