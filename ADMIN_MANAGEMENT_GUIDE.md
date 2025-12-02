# Admin Management Guide for Production

## Overview

When your app is launched in production, you need a secure way to manage admin functions without exposing them to regular users. Here are the recommended approaches:

---

## Option 1: Admin Role-Based Access (Recommended)

### How It Works
- Add an `isAdmin` or `role` field to user documents
- Check user role before showing admin features
- Admin features hidden from regular users

### Implementation

#### 1. Update User Type

```typescript
// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  pushToken?: string;
  role?: 'admin' | 'user';  // NEW: Add role field
  isAdmin?: boolean;         // Or use boolean flag
}
```

#### 2. Create Admin Users in Firestore

In Firebase Console, manually set admin users:

```javascript
// In Firestore Console, edit user document:
{
  id: "user123",
  name: "Admin User",
  email: "admin@eventbuddy.com",
  role: "admin"  // or isAdmin: true
}
```

#### 3. Add Admin Check Hook

```typescript
// src/hooks/useIsAdmin.ts
import { useUser } from '../context/UserContext';

export const useIsAdmin = () => {
  const { currentUser } = useUser();
  return currentUser?.role === 'admin' || currentUser?.isAdmin === true;
};
```

#### 4. Protect Admin Routes

```typescript
// In ProfileScreen or Navigation
import { useIsAdmin } from '../hooks/useIsAdmin';

export default function ProfileScreen({ navigation }: any) {
  const isAdmin = useIsAdmin();
  
  return (
    <View>
      {/* Regular user content */}
      
      {isAdmin && (
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminPanel')}
        >
          <Text>🔐 Admin Panel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

#### 5. Secure with Firestore Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Regular users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Only admins can perform certain operations
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin() || resource.data.creatorId == request.auth.uid;
    }
  }
}
```

### Pros ✅
- Secure and scalable
- Works in production
- Can have multiple admins
- Role-based permissions

### Cons ❌
- Requires Firebase Authentication
- Need to manually set admin users
- More complex setup

---

## Option 2: Separate Admin App

### How It Works
- Create a separate admin web app
- Use Firebase Admin SDK (server-side)
- Completely separate from user app

### Implementation

#### 1. Create Admin Web App

```bash
# Create new React/Next.js app for admin
npx create-next-app eventbuddy-admin
cd eventbuddy-admin
npm install firebase-admin
```

#### 2. Use Firebase Admin SDK

```typescript
// admin-app/lib/firebase-admin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const db = admin.firestore();
```

#### 3. Admin Dashboard Features

```typescript
// admin-app/pages/dashboard.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1>EventBuddy Admin</h1>
      
      {/* View all events */}
      <EventsList />
      
      {/* Manage users */}
      <UsersList />
      
      {/* Database operations */}
      <DatabaseTools />
      
      {/* Analytics */}
      <Analytics />
    </div>
  );
}
```

#### 4. Protect with Authentication

```typescript
// Use NextAuth or similar
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session || session.user.email !== 'admin@eventbuddy.com') {
    return { redirect: { destination: '/login' } };
  }
  
  return { props: {} };
}
```

### Pros ✅
- Complete separation from user app
- Full admin SDK access
- Can use server-side operations
- Better security

### Cons ❌
- Need to maintain separate app
- More infrastructure
- Requires hosting

---

## Option 3: Secret Access Code

### How It Works
- Hidden admin screen accessible via secret code
- Simple but less secure
- Good for small teams

### Implementation

#### 1. Add Secret Code Screen

```typescript
// src/screens/AdminAccessScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

const ADMIN_CODE = 'EVENTBUDDY2025'; // Change this!

export default function AdminAccessScreen({ navigation }: any) {
  const [code, setCode] = useState('');
  
  const handleSubmit = () => {
    if (code === ADMIN_CODE) {
      navigation.navigate('AdminPanel');
    } else {
      alert('Invalid code');
    }
  };
  
  return (
    <View>
      <Text>Enter Admin Code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        secureTextEntry
        placeholder="Admin Code"
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Access Admin</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### 2. Hidden Access in Profile

```typescript
// In ProfileScreen - tap logo 7 times to reveal
const [tapCount, setTapCount] = useState(0);

<TouchableOpacity 
  onPress={() => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 7) {
      navigation.navigate('AdminAccess');
      setTapCount(0);
    }
  }}
>
  <Text>⚙️</Text>
</TouchableOpacity>
```

### Pros ✅
- Simple to implement
- No database changes needed
- Quick access for admins

### Cons ❌
- Less secure
- Code can be discovered
- Not scalable

---

## Option 4: Firebase Console Only

### How It Works
- Use Firebase Console for all admin tasks
- No admin features in app
- Most secure but less convenient

### What You Can Do in Firebase Console

#### 1. Manage Events
- View all events in Firestore
- Edit/delete events manually
- Export data

#### 2. Manage Users
- View user list
- Edit user profiles
- Delete users

#### 3. Database Operations
- Run queries
- Bulk updates
- Import/export data

#### 4. Analytics
- View usage statistics
- Monitor performance
- Check errors

### Pros ✅
- Most secure
- No code needed
- Built-in by Firebase

### Cons ❌
- Less convenient
- Requires Firebase access
- No custom features

---

## Recommended Approach for Production

### Phase 1: Launch (Use Option 4)
- Use Firebase Console for admin tasks
- Simple and secure
- No additional code needed

### Phase 2: Growth (Use Option 1)
- Implement role-based access
- Add admin panel in app
- Secure with Firestore rules

### Phase 3: Scale (Use Option 2)
- Build separate admin web app
- Use Firebase Admin SDK
- Full-featured admin dashboard

---

## Admin Features to Include

### Essential Features
- ✅ View all events
- ✅ Delete/cancel events
- ✅ View all users
- ✅ Manage reported content
- ✅ View analytics

### Advanced Features
- ✅ Send push notifications to all users
- ✅ Feature events (pin to top)
- ✅ Ban users
- ✅ Export data
- ✅ Database backups
- ✅ Moderate chat messages

---

## Security Best Practices

### DO ✅
- Use Firebase Authentication
- Implement Firestore Security Rules
- Store admin credentials securely
- Log admin actions
- Use HTTPS only
- Regular security audits

### DON'T ❌
- Hardcode admin credentials in app
- Expose admin features to all users
- Skip authentication checks
- Use weak passwords
- Share admin access widely

---

## Implementation Checklist

### For Role-Based Access (Option 1)

- [ ] Add `role` field to User type
- [ ] Create `useIsAdmin` hook
- [ ] Update ProfileScreen with admin button
- [ ] Create AdminPanelScreen
- [ ] Add admin features (view events, users, etc.)
- [ ] Implement Firestore Security Rules
- [ ] Manually set admin users in Firestore
- [ ] Test admin access
- [ ] Test regular user access (should not see admin)
- [ ] Deploy and verify in production

### For Separate Admin App (Option 2)

- [ ] Create new admin web app
- [ ] Set up Firebase Admin SDK
- [ ] Implement authentication
- [ ] Build admin dashboard
- [ ] Add event management
- [ ] Add user management
- [ ] Add analytics
- [ ] Deploy admin app
- [ ] Secure with authentication
- [ ] Test all features

---

## Quick Start: Add Admin Role to Existing App

If you want to add admin features to your current app quickly:

1. **Update User Type** (add `isAdmin` field)
2. **Create Admin Hook** (`useIsAdmin`)
3. **Add Admin Button** (in ProfileScreen, only show if admin)
4. **Create Admin Panel** (reuse existing AdminScreen)
5. **Set Admin User** (manually in Firestore Console)

This gives you basic admin access without major changes!

---

## Need Help?

Choose the approach that fits your needs:
- **Just launched?** → Use Firebase Console (Option 4)
- **Small team?** → Use Secret Code (Option 3)
- **Growing app?** → Use Role-Based Access (Option 1)
- **Large scale?** → Build Separate Admin App (Option 2)
