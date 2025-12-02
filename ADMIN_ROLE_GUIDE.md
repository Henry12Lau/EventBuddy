# Admin Role Guide - Simple Number System

## Overview

Admin access is controlled by a simple number in Firestore:
- **role = 0** → Admin user 🔐
- **role = 1** → Normal user 👤
- **No role field** → Normal user (default)

---

## How to Make Yourself Admin

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **eventbuddy-dev-26ce8**
3. Click **Firestore Database** in left menu

### Step 2: Find Your User

1. Click on **users** collection
2. Find your user document (probably ID: **1**)
3. Click on the document to open it

### Step 3: Add/Edit Role Field

**If role field doesn't exist:**
1. Click **"Add field"** button
2. Field name: `role`
3. Field type: **number**
4. Value: `0`
5. Click **Save**

**If role field already exists:**
1. Click on the `role` field
2. Change value to `0`
3. Click **Save**

### Step 4: Restart App

1. Close your app completely
2. Restart it
3. Go to **Profile** tab
4. You should see purple **"🔐 Admin Panel"** button

---

## Visual Guide

### Your User Document Should Look Like:

```
users/1
├── id: "1"
├── name: "Demo User"
├── email: "demo@eventbuddy.com"
└── role: 0  ← Add this field (number)
```

### In Firebase Console:

```
Collection: users
Document: 1

Fields:
┌─────────┬────────┬──────────────────────┐
│ Field   │ Type   │ Value                │
├─────────┼────────┼──────────────────────┤
│ id      │ string │ 1                    │
│ name    │ string │ Demo User            │
│ email   │ string │ demo@eventbuddy.com  │
│ role    │ number │ 0                    │ ← This makes you admin!
└─────────┴────────┴──────────────────────┘
```

---

## Role Values

| Role | Value | Access Level | Description |
|------|-------|--------------|-------------|
| Admin | `0` | Full access | Can access Admin Panel |
| User | `1` | Normal access | Regular user, no admin features |
| Not set | `undefined` | Normal access | Treated as regular user |

---

## Quick Test

### Check if You're Admin:

1. **Open app**
2. **Go to Profile tab**
3. **Look for "🔐 Admin Panel" button** (purple)
   - ✅ **See it?** → You're admin!
   - ❌ **Don't see it?** → Check Firestore role field

---

## Adding More Admins

To make another user an admin:

1. Go to Firebase Console → Firestore
2. Find their user document in `users` collection
3. Add/Edit `role` field to `0`
4. They need to restart app

**Example:**
```
users/2
├── id: "2"
├── name: "Team Member"
├── email: "team@eventbuddy.com"
└── role: 0  ← Makes them admin
```

---

## Removing Admin Access

To remove admin access from a user:

1. Go to Firebase Console → Firestore
2. Find their user document
3. Change `role` field to `1` (or delete the field)
4. They need to restart app

---

## Seed Data

When you run "Seed Mock Data" in Database Migration:
- Demo User (ID: 1) is automatically created with `role: 0` (admin)
- So after seeding, you're already an admin!

---

## Troubleshooting

### Admin Button Not Showing

**Problem:** I set role to 0 but don't see admin button

**Solutions:**

1. **Verify in Firestore:**
   - Open Firebase Console
   - Check `users/1` document
   - Confirm `role` field is **number** type (not string!)
   - Value should be `0` (not "0")

2. **Check User Data in App:**
   - Add this to ProfileScreen temporarily:
   ```typescript
   console.log('Current User:', currentUser);
   console.log('User Role:', currentUser?.role);
   console.log('Is Admin:', isAdmin);
   ```

3. **Restart App Completely:**
   - Stop the app
   - Clear cache: `npm start -- --clear`
   - Reopen app

4. **Check User Context:**
   - Make sure user data is loading from Firestore
   - Check if `getUserById` is working

### Role Field is String Instead of Number

**Problem:** I set role but it's saved as "0" (string) instead of 0 (number)

**Solution:**
1. In Firebase Console, delete the field
2. Add it again, make sure to select **number** type
3. Enter `0` (without quotes)

### Multiple Users with Same ID

**Problem:** Not sure which user document is mine

**Solution:**
1. Check your Profile screen - it shows your user ID
2. Or check console logs for current user ID
3. Find that document in Firestore

---

## Security Notes

### Current Setup:
- ✅ Simple to manage
- ✅ Easy to change in Firebase Console
- ✅ No code changes needed
- ✅ Works without login

### For Production:
- ⚠️ Anyone with Firestore access can change roles
- ⚠️ Consider adding Firestore Security Rules
- ⚠️ Or implement proper authentication

### Recommended Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read their own data
    match /users/{userId} {
      allow read: if true;
      // Only allow users to update their own profile (but not role!)
      allow update: if request.auth.uid == userId && 
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
    }
    
    // Events
    match /events/{eventId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if true; // Adjust based on your needs
    }
  }
}
```

---

## Examples

### Example 1: Make User ID "1" Admin

```
Firebase Console → Firestore → users → 1

Add field:
- Field: role
- Type: number
- Value: 0
```

### Example 2: Multiple Admins

```
users/1
└── role: 0  (Admin)

users/5
└── role: 0  (Admin)

users/10
└── role: 1  (Normal user)

users/15
└── (no role field = Normal user)
```

### Example 3: Change Admin to Normal User

```
Before:
users/1
└── role: 0  (Admin)

After:
users/1
└── role: 1  (Normal user)
```

---

## Quick Reference

### Make User Admin:
```
Firestore → users → {userId} → Add field
Field: role (number) = 0
```

### Check Admin Status:
```typescript
import { useIsAdmin } from '../hooks/useIsAdmin';

const isAdmin = useIsAdmin();
// true if role === 0
// false if role === 1 or undefined
```

### Role Values:
- `0` = Admin 🔐
- `1` = Normal User 👤
- `undefined` = Normal User 👤

---

## Summary

✅ **Super simple: Just set `role: 0` in Firestore**
✅ **No code changes needed**
✅ **Easy to manage in Firebase Console**
✅ **Works without login system**
✅ **Demo User (ID: 1) is already admin after seeding**

Just go to Firebase Console, set `role: 0` for your user, restart app, and you're an admin!
