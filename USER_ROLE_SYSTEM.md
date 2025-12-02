# User Role System - Summary

## Overview

All new users are automatically created with `role: 1` (normal user). Admins must be manually set to `role: 0` in Firebase Console.

---

## How It Works

### When a New User Signs Up:

1. User enters name and email in WelcomeScreen
2. User is created with **role: 1** (normal user) by default
3. User data saved to:
   - Local storage (AsyncStorage)
   - Firestore database
4. User can use the app normally

### When User Opens Profile:

1. App loads user data from local storage
2. App syncs with Firestore to get latest data (including role)
3. If role changed in Firestore, it updates in the app
4. Admin buttons show/hide based on role

---

## Role Values

| Role | Value | Description | Default |
|------|-------|-------------|---------|
| Admin | `0` | Full access to admin features | No |
| Normal User | `1` | Regular user access | **Yes** ✅ |

---

## User Creation Flow

```
New User Signs Up
    ↓
Generate User ID (timestamp)
    ↓
Create User Object
{
  id: "1234567890",
  name: "John Doe",
  email: "john@example.com",
  role: 1  ← Automatically set to 1
}
    ↓
Save to AsyncStorage
    ↓
Save to Firestore (with role: 1)
    ↓
User can use app
```

---

## Making a User Admin

### Step 1: Find User in Firestore

1. Go to Firebase Console
2. Firestore Database → `users` collection
3. Find the user document

### Step 2: Change Role to 0

1. Click on the user document
2. Find the `role` field
3. Change value from `1` to `0`
4. Save

### Step 3: User Restarts App

1. User closes and reopens app
2. Profile screen syncs with Firestore
3. Role updates to 0
4. Admin buttons appear

---

## Code Changes Made

### 1. User Type (`src/types/index.ts`)
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  pushToken?: string;
  role?: number;  // 0 = admin, 1 = normal user
}
```

### 2. User Service (`src/services/userService.ts`)
```typescript
// createUser now includes default role
export const createUser = async (
  userId: string, 
  name: string, 
  email: string, 
  role: number = 1  // Default to normal user
): Promise<void> => {
  await setDoc(doc(db, USERS_COLLECTION, userId), {
    name,
    email,
    role,  // Always includes role
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

// saveUserProfile preserves role on updates
export const saveUserProfile = async (
  userId: string, 
  userData: Omit<User, 'id'>
): Promise<void> => {
  if (userDoc.exists()) {
    // Don't overwrite role if not provided
    const updateData: any = { ...userData };
    if (updateData.role === undefined) {
      delete updateData.role;
    }
    await updateDoc(userRef, updateData);
  } else {
    // New user gets role: 1 by default
    await setDoc(userRef, {
      ...userData,
      role: userData.role !== undefined ? userData.role : 1,
      createdAt: Timestamp.now()
    });
  }
};
```

### 3. Storage Service (`src/services/storageService.ts`)
```typescript
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: number;  // Added role field
}
```

### 4. Profile Screen (`src/screens/ProfileScreen.tsx`)
```typescript
const loadUserProfile = async () => {
  if (currentUser) {
    // Sync with Firestore
    const firestoreUser = await getUserById(currentUser.id);
    if (firestoreUser) {
      setUser(firestoreUser);
      // Update context with role from Firestore
      setCurrentUser({
        ...currentUser,
        role: firestoreUser.role
      });
    }
  }
};
```

### 5. Admin Hook (`src/hooks/useIsAdmin.ts`)
```typescript
export const useIsAdmin = (): boolean => {
  const { currentUser } = useUser();
  if (!currentUser) return false;
  return currentUser.role === 0;  // Only role 0 is admin
};
```

### 6. Seed Data (`src/services/seedData.ts`)
```typescript
const sampleUser = {
  name: 'Demo User',
  email: 'demo@eventbuddy.com',
  role: 0  // Demo user is admin
};
```

---

## Testing

### Test New User Creation:

1. Clear app data (or use new device)
2. Open app → WelcomeScreen
3. Enter name and email
4. Submit
5. Check Firestore → User should have `role: 1`
6. Check Profile → No admin buttons visible

### Test Admin Access:

1. Go to Firebase Console
2. Change user's role to `0`
3. Restart app
4. Go to Profile
5. Should see admin buttons

### Test Role Sync:

1. Open app as normal user (role: 1)
2. While app is open, change role to 0 in Firebase
3. Go to Profile screen
4. Profile loads → syncs with Firestore
5. Admin buttons should appear

---

## Important Notes

### ✅ What Works:

- New users automatically get `role: 1`
- Role is saved to Firestore
- Role syncs when Profile screen loads
- Admin buttons show/hide based on role
- Role persists across app restarts

### ⚠️ Important:

- **Role must be changed in Firebase Console** (not in app)
- **User must restart app** or visit Profile to sync role
- **Seed data creates admin user** (Demo User with role: 0)
- **Role is preserved** when updating profile (name/email)

### 🔒 Security:

- Role is stored in Firestore (server-side)
- Cannot be changed by user in app
- Must be changed by admin in Firebase Console
- Consider adding Firestore Security Rules to protect role field

---

## Firestore Security Rules (Recommended)

Add these rules to prevent users from changing their own role:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth.uid == userId;
      
      // Users can update their profile but NOT their role
      allow update: if request.auth.uid == userId && 
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
      
      // Only allow creation with role: 1 (or no role)
      allow create: if request.auth.uid == userId && 
                       (!request.resource.data.keys().hasAny(['role']) || 
                        request.resource.data.role == 1);
    }
  }
}
```

**Note:** These rules require Firebase Authentication. For now, you can use test mode during development.

---

## Quick Reference

### Default Role for New Users:
```
role: 1 (normal user)
```

### Make User Admin:
```
Firebase Console → Firestore → users/{userId}
Change: role = 0
```

### Check if User is Admin:
```typescript
const isAdmin = useIsAdmin();
// true if role === 0
// false if role === 1 or undefined
```

### Where Role is Set:
- **New users:** `createUser()` in userService.ts
- **Seed data:** `seedData.ts` (Demo User has role: 0)
- **Manual:** Firebase Console

---

## Summary

✅ **All new users get `role: 1` automatically**
✅ **Admins must be set to `role: 0` in Firebase Console**
✅ **Role syncs when Profile screen loads**
✅ **Admin buttons only show for `role: 0`**
✅ **Demo User (from seed data) is admin by default**

The system is now complete and working!
