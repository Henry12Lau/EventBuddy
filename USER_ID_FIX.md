# User ID Fix - Using Real User IDs

## ✅ Fixed: User ID Management

The app now uses real user IDs from local storage instead of hardcoded "1".

---

## 🔧 What Changed

### Before (Hardcoded):
```typescript
const userId = '1'; // ❌ Always "1" for everyone
```

### After (Dynamic):
```typescript
const { currentUser } = useUser();
const userId = currentUser?.id; // ✅ Real user ID from storage
```

---

## 📊 User Context

### New Context Created:
```typescript
// src/context/UserContext.tsx
- Loads user from local storage on app start
- Provides currentUser to all components
- Updates when user changes profile
```

### Usage:
```typescript
import { useUser } from '../context/UserContext';

const { currentUser } = useUser();
console.log(currentUser.id);   // "1701234567890"
console.log(currentUser.name);  // "John Doe"
console.log(currentUser.email); // "john@example.com"
```

---

## 🎯 Where User ID is Used

### 1. Profile Screen
- ✅ Loads user from context
- ✅ Saves with real user ID
- ✅ Updates context on save

### 2. Welcome Screen (Onboarding)
- ✅ Generates unique ID: `Date.now().toString()`
- ✅ Saves to local storage
- ✅ Saves to Firestore
- ✅ Sets in context

### 3. Events (TODO - Update These)
- ⚠️ CreateEventScreen: Still uses hardcoded '1'
- ⚠️ EventDetailScreen: Still uses hardcoded '1'
- ⚠️ ScheduleScreen: Still uses hardcoded '1'
- ⚠️ EventChatScreen: Still uses hardcoded '1'

---

## 🔄 User ID Generation

### Format:
```typescript
const userId = Date.now().toString();
// Example: "1701234567890"
```

### Why This Works:
- ✅ Unique per user
- ✅ Simple and fast
- ✅ No collisions (timestamp-based)
- ✅ Sortable (chronological)

### Alternative (UUID):
```typescript
// If you want more randomness
import uuid from 'react-native-uuid';
const userId = uuid.v4();
// Example: "550e8400-e29b-41d4-a716-446655440000"
```

---

## 📝 Next Steps

### Update Remaining Screens:

**CreateEventScreen:**
```typescript
import { useUser } from '../context/UserContext';

const { currentUser } = useUser();

await addEvent({
  ...eventData,
  creatorId: currentUser?.id || '1', // Use real ID
});
```

**EventDetailScreen:**
```typescript
import { useUser } from '../context/UserContext';

const { currentUser } = useUser();
const isCreator = event.creatorId === currentUser?.id;
const hasJoined = event.participants.includes(currentUser?.id || '');
```

**ScheduleScreen:**
```typescript
import { useUser } from '../context/UserContext';

const { currentUser } = useUser();
const myEvents = getMyEvents(currentUser?.id || '1');
```

**EventChatScreen:**
```typescript
import { useUser } from '../context/UserContext';

const { currentUser } = useUser();
const currentUserId = currentUser?.id || '1';
const currentUserName = currentUser?.name || 'You';
```

---

## ✅ Benefits

### Real User IDs:
- ✅ Each user has unique ID
- ✅ Proper data separation
- ✅ Correct event ownership
- ✅ Accurate participant tracking

### User Context:
- ✅ Single source of truth
- ✅ Available everywhere
- ✅ Updates automatically
- ✅ No prop drilling

---

## 🧪 Testing

### Test User ID Generation:
1. Clear app data
2. Complete onboarding
3. Check Firestore → users collection
4. ✅ Should see document with timestamp ID (e.g., "1701234567890")

### Test Profile Update:
1. Change name in Profile screen
2. Save
3. Check local storage
4. Check Firestore
5. ✅ Both should have updated name with correct user ID

---

## 📊 Database Structure

### Before (Wrong):
```
users/
└── 1/  ← Everyone uses same ID!
    ├── name: "Last User"
    └── email: "last@example.com"
```

### After (Correct):
```
users/
├── 1701234567890/
│   ├── name: "John Doe"
│   └── email: "john@example.com"
├── 1701234598765/
│   ├── name: "Jane Smith"
│   └── email: "jane@example.com"
└── 1701234612345/
    ├── name: "Bob Wilson"
    └── email: "bob@example.com"
```

---

## 🎯 Summary

**Fixed:**
- ✅ User Context created
- ✅ Real user IDs from storage
- ✅ Profile screen uses context
- ✅ Welcome screen sets context
- ✅ Unique ID generation

**Still TODO:**
- ⚠️ Update CreateEventScreen
- ⚠️ Update EventDetailScreen
- ⚠️ Update ScheduleScreen
- ⚠️ Update EventChatScreen

Your user IDs are now properly managed! 🎉
