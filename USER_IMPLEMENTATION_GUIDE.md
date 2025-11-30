# User Implementation Guide

## ✅ What's Been Implemented

Your app now stores user profiles in Firestore with just **name** and **email**.

### User Data Structure

```javascript
users/{userId}
  ├── name: string
  ├── email: string
  ├── createdAt: timestamp
  └── updatedAt: timestamp
```

Simple and clean! 🎉

---

## 📁 Files Created/Updated

### New Files:
- ✅ `src/services/userService.ts` - User CRUD operations
- ✅ `FIRESTORE_SECURITY_RULES.md` - Security rules guide

### Updated Files:
- ✅ `src/types/index.ts` - Simplified User interface
- ✅ `src/screens/ProfileScreen.tsx` - Save/load from Firestore
- ✅ `src/services/seedData.ts` - Seeds sample user
- ✅ `src/screens/AdminScreen.tsx` - Updated seed info

---

## 🚀 How to Use

### 1. Enable Firestore (if not done)
- Go to Firebase Console
- Enable Firestore Database
- Set rules to test mode

### 2. Update Security Rules

Add this to your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if true; // For testing
    }
    match /events/{eventId} {
      allow read, write: if true;
    }
  }
}
```

### 3. Seed Sample Data
1. Open your app
2. Go to **Admin** tab
3. Click "Seed Sample Data"
4. This creates:
   - 1 user: Demo User (demo@eventbuddy.com)
   - 9 sample events

### 4. Test Profile Screen
1. Go to **Profile** tab
2. You'll see the loaded user data
3. Edit name/email
4. Click "Save Profile"
5. Refresh app - data persists! ✅

---

## 🔧 User Service Functions

### Get User by ID
```typescript
import { getUserById } from '../services/userService';

const user = await getUserById('1');
console.log(user.name, user.email);
```

### Save/Update User Profile
```typescript
import { saveUserProfile } from '../services/userService';

await saveUserProfile('1', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Create New User
```typescript
import { createUser } from '../services/userService';

await createUser('user123', 'Jane Smith', 'jane@example.com');
```

---

## 📊 Firestore Structure

Your database now looks like:

```
Firestore
├── users/
│   └── 1
│       ├── name: "Demo User"
│       ├── email: "demo@eventbuddy.com"
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── events/
    ├── event1
    ├── event2
    └── ...
```

---

## 🎯 Current User ID

Currently using hardcoded user ID: `'1'`

**Where it's used:**
- ProfileScreen: Loading/saving profile
- CreateEventScreen: Setting creatorId
- EventDetailScreen: Checking if user joined
- ScheduleScreen: Filtering user's events

**TODO:** Replace with real authentication
- Add Firebase Authentication
- Use `auth.currentUser.uid` instead of `'1'`

---

## ✨ Features Working Now

### Profile Screen
- ✅ Loads user data from Firestore
- ✅ Saves name and email
- ✅ Form validation (required fields, email format)
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages

### Data Persistence
- ✅ User profile saved to Firestore
- ✅ Data persists across app restarts
- ✅ Updates reflected immediately

---

## 🔮 Future Enhancements

### When You Add Authentication:

1. **Replace hardcoded user ID**
```typescript
// Before
const userId = '1';

// After (with Firebase Auth)
import { auth } from '../config/firebase';
const userId = auth.currentUser?.uid;
```

2. **Create user on signup**
```typescript
// After user signs up with Firebase Auth
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await createUser(userCredential.user.uid, name, email);
```

3. **Load current user**
```typescript
// On app start
const currentUser = auth.currentUser;
if (currentUser) {
  const userData = await getUserById(currentUser.uid);
  // Use userData in app
}
```

---

## 🧪 Testing

### Test Profile Save
1. Go to Profile tab
2. Enter name: "Test User"
3. Enter email: "test@example.com"
4. Click "Save Profile"
5. Check Firebase Console → users/1
6. Should see updated data

### Test Profile Load
1. Save profile with some data
2. Close and reopen app
3. Go to Profile tab
4. Data should load automatically

### Test Validation
1. Try saving with empty name → Error
2. Try saving with invalid email → Error
3. Try saving with valid data → Success

---

## 📝 Notes

### Why Just Name and Email?
- Simple and focused
- Easy to extend later
- Covers basic user identification
- No unnecessary complexity

### Adding More Fields Later?
Easy! Just update:
1. `src/types/index.ts` - Add field to User interface
2. `src/screens/ProfileScreen.tsx` - Add input field
3. `src/services/userService.ts` - No changes needed!

Example:
```typescript
// Add phone number
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // New field
}
```

---

## ❓ FAQ

**Q: Can I add more user fields?**
A: Yes! Just update the User interface and add inputs in ProfileScreen.

**Q: How do I use real authentication?**
A: Enable Firebase Auth, then replace '1' with `auth.currentUser.uid`

**Q: Where is the user data stored?**
A: Firestore → users collection → document with userId

**Q: Can other users see my profile?**
A: Yes, with current rules. User names are shown in events/chat.

**Q: How do I make profiles private?**
A: Update security rules to restrict read access

---

## ✅ Summary

You now have:
- ✅ User profiles stored in Firestore
- ✅ Simple name + email fields
- ✅ Profile screen with save/load
- ✅ Form validation
- ✅ Sample user seeded
- ✅ Ready for authentication integration

Next step: Implement the Messages collection for persistent chat! 💬
