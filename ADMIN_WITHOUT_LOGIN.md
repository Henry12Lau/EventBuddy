# Admin Access Without Login

## Overview

Since your app doesn't have a login system, admin access is controlled by a simple configuration file. No authentication needed!

---

## How It Works

The app checks if you're an admin by looking at:
1. **Your User ID** - Is it in the admin list?
2. **Your Email** - Is it in the admin list?
3. **Firestore Role** - Do you have `role: 'admin'` in database?

If any of these match, you get admin access!

---

## Method 1: Add Your User ID (Easiest)

### Step 1: Find Your User ID

Your current user ID is hardcoded in the app. Check:
- `UserContext` - look for default user ID
- Profile screen - your user ID
- Most likely it's `'1'` (already set as admin!)

### Step 2: Edit Admin Config

Open `src/config/adminConfig.ts`:

```typescript
export const ADMIN_USER_IDS = [
  '1',  // This is already set!
  // Add more user IDs here if needed
];
```

### Step 3: Done!

That's it! User ID `'1'` is already an admin. Just restart the app and go to Profile tab.

---

## Method 2: Add Your Email

### Step 1: Check Your Email

Go to Profile tab and see what email you have set.

### Step 2: Edit Admin Config

Open `src/config/adminConfig.ts`:

```typescript
export const ADMIN_EMAILS = [
  'demo@eventbuddy.com',  // Already set
  'admin@eventbuddy.com',
  'your-email@example.com',  // Add your email here
];
```

### Step 3: Save and Restart

Save the file and restart the app. You'll have admin access!

---

## Method 3: Set in Firestore (Optional)

If you want to manage admins through the database:

1. Go to Firebase Console → Firestore
2. Find `users` collection → Your user document
3. Add field: `role` = `"admin"` (string)
4. Save
5. Restart app

---

## Quick Test

### Check if You're Admin:

1. **Open app**
2. **Go to Profile tab**
3. **Look for purple button: "🔐 Admin Panel"**
4. **If you see it** → You're an admin! ✅
5. **If you don't see it** → Not admin yet ❌

---

## Adding More Admins

### For Team Members:

**Option A: Add Their User ID**
```typescript
// src/config/adminConfig.ts
export const ADMIN_USER_IDS = [
  '1',    // You
  '2',    // Team member 1
  '3',    // Team member 2
];
```

**Option B: Add Their Email**
```typescript
// src/config/adminConfig.ts
export const ADMIN_EMAILS = [
  'demo@eventbuddy.com',
  'teammate1@example.com',
  'teammate2@example.com',
];
```

---

## Current Setup

By default, these are already set as admins:

### User IDs:
- `'1'` ← Your current user ID

### Emails:
- `demo@eventbuddy.com`
- `admin@eventbuddy.com`

**So if you're using user ID '1' or email 'demo@eventbuddy.com', you're already an admin!**

---

## Troubleshooting

### Admin Button Not Showing

**Check 1: Verify Your User ID**
```typescript
// In ProfileScreen or any component
console.log('Current User:', currentUser);
console.log('User ID:', currentUser?.id);
console.log('User Email:', currentUser?.email);
```

**Check 2: Verify Admin Config**
```typescript
// In src/config/adminConfig.ts
console.log('Admin IDs:', ADMIN_USER_IDS);
console.log('Admin Emails:', ADMIN_EMAILS);
```

**Check 3: Restart App**
- Stop the app completely
- Run `npm start -- --clear` to clear cache
- Reopen the app

### Wrong User ID

If your user ID is not '1':

1. Find your actual user ID (check console logs or Profile screen)
2. Update `src/config/adminConfig.ts`:
```typescript
export const ADMIN_USER_IDS = [
  'your-actual-user-id',  // Replace with your ID
];
```
3. Save and restart

---

## Security Notes

### Development:
- ✅ Simple and easy to manage
- ✅ No login required
- ✅ Perfect for testing

### Production:
- ⚠️ Admin config is in the code (visible to anyone who decompiles app)
- ⚠️ Consider using Firestore-based admin roles for production
- ⚠️ Or implement proper authentication

### Recommendations:

**For Now (Development):**
- Use the config file approach ✅
- Easy to add/remove admins
- No setup needed

**For Production:**
- Move admin list to Firestore
- Or implement Firebase Authentication
- Or use environment variables

---

## Examples

### Example 1: Single Admin (You)

```typescript
// src/config/adminConfig.ts
export const ADMIN_USER_IDS = ['1'];
export const ADMIN_EMAILS = ['your-email@example.com'];
```

### Example 2: Multiple Admins

```typescript
// src/config/adminConfig.ts
export const ADMIN_USER_IDS = [
  '1',   // You
  '5',   // Co-founder
  '10',  // Developer
];

export const ADMIN_EMAILS = [
  'you@eventbuddy.com',
  'cofounder@eventbuddy.com',
  'dev@eventbuddy.com',
];
```

### Example 3: Email-Only Admin

```typescript
// src/config/adminConfig.ts
export const ADMIN_USER_IDS = [];  // Empty

export const ADMIN_EMAILS = [
  'admin@eventbuddy.com',
  'support@eventbuddy.com',
];
```

---

## What You Can Do as Admin

Once you have admin access:

1. **Go to Profile tab**
2. **Tap "🔐 Admin Panel"**
3. **Access admin features:**
   - Migrate database
   - Seed sample data
   - View all events
   - Manage users (future)

---

## Quick Reference

### Make Yourself Admin:
```typescript
// src/config/adminConfig.ts
export const ADMIN_USER_IDS = ['1'];  // Your user ID
```

### Check Admin Status:
```typescript
import { useIsAdmin } from '../hooks/useIsAdmin';

const isAdmin = useIsAdmin();
console.log('Am I admin?', isAdmin);
```

### Admin Button Location:
- Profile Tab → "🔐 Admin Panel" (purple button)

---

## Summary

✅ **No login needed!**
✅ **Just add your user ID or email to `adminConfig.ts`**
✅ **User ID '1' is already set as admin**
✅ **Restart app to see admin button**

That's it! Super simple admin access without any authentication system.
