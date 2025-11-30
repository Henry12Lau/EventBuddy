# Firestore Queries Guide - Finding Owners & Participants

## 🔍 How to Find Event Owners and Participants

Your events store user IDs. Here's how to find the actual user information.

---

## 📊 Current Data Structure

### Event Document:
```javascript
events/event123
  ├── title: "Morning Basketball"
  ├── creatorId: "1"              // ← Owner's user ID
  ├── participants: ["1", "2", "3"] // ← Participant user IDs
  └── ...
```

### User Documents:
```javascript
users/1
  ├── name: "Demo User"
  └── email: "demo@eventbuddy.com"

users/2
  ├── name: "John Doe"
  └── email: "john@example.com"

users/3
  ├── name: "Jane Smith"
  └── email: "jane@example.com"
```

---

## 🎯 Finding Event Owner

### Method 1: In Firebase Console

1. **Open Firestore Database**
2. **Click on `events` collection**
3. **Click on any event document**
4. **Look at `creatorId` field** (e.g., "1")
5. **Go to `users` collection**
6. **Click on document with that ID** (e.g., users/1)
7. **See owner's name and email**

### Method 2: Using Code

```typescript
// Get event owner information
const getEventOwner = async (eventId: string) => {
  // 1. Get the event
  const eventDoc = await getDoc(doc(db, 'events', eventId));
  const event = eventDoc.data();
  
  // 2. Get the creator ID
  const creatorId = event.creatorId;
  
  // 3. Get the user document
  const userDoc = await getDoc(doc(db, 'users', creatorId));
  const owner = userDoc.data();
  
  return {
    id: creatorId,
    name: owner.name,
    email: owner.email
  };
};

// Usage
const owner = await getEventOwner('event123');
console.log(owner.name); // "Demo User"
```

---

## 👥 Finding Event Participants

### Method 1: In Firebase Console

1. **Open event document**
2. **Look at `participants` array** (e.g., ["1", "2", "3"])
3. **For each ID, go to `users` collection**
4. **Click on that user document**
5. **See participant's name and email**

### Method 2: Using Code

```typescript
// Get all participants for an event
const getEventParticipants = async (eventId: string) => {
  // 1. Get the event
  const eventDoc = await getDoc(doc(db, 'events', eventId));
  const event = eventDoc.data();
  
  // 2. Get participant IDs
  const participantIds = event.participants;
  
  // 3. Fetch all user documents
  const participants = await Promise.all(
    participantIds.map(async (userId) => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const user = userDoc.data();
      return {
        id: userId,
        name: user.name,
        email: user.email
      };
    })
  );
  
  return participants;
};

// Usage
const participants = await getEventParticipants('event123');
participants.forEach(p => {
  console.log(p.name); // "Demo User", "John Doe", "Jane Smith"
});
```

---

## 🔎 Advanced Queries

### Find All Events Created by a User

```typescript
// Find all events where user is the creator
const getEventsByCreator = async (userId: string) => {
  const eventsQuery = query(
    collection(db, 'events'),
    where('creatorId', '==', userId)
  );
  
  const querySnapshot = await getDocs(eventsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Usage
const myEvents = await getEventsByCreator('1');
console.log(`User created ${myEvents.length} events`);
```

### Find All Events a User Joined

```typescript
// Find all events where user is a participant
const getEventsByParticipant = async (userId: string) => {
  const eventsQuery = query(
    collection(db, 'events'),
    where('participants', 'array-contains', userId)
  );
  
  const querySnapshot = await getDocs(eventsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Usage
const joinedEvents = await getEventsByParticipant('1');
console.log(`User joined ${joinedEvents.length} events`);
```

### Get Event with Owner and Participants Info

```typescript
// Get complete event information with user details
const getEventWithUsers = async (eventId: string) => {
  // 1. Get event
  const eventDoc = await getDoc(doc(db, 'events', eventId));
  const event = eventDoc.data();
  
  // 2. Get owner info
  const ownerDoc = await getDoc(doc(db, 'users', event.creatorId));
  const owner = ownerDoc.data();
  
  // 3. Get all participants info
  const participants = await Promise.all(
    event.participants.map(async (userId) => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return {
        id: userId,
        ...userDoc.data()
      };
    })
  );
  
  return {
    ...event,
    id: eventId,
    owner: {
      id: event.creatorId,
      name: owner.name,
      email: owner.email
    },
    participantDetails: participants
  };
};

// Usage
const fullEvent = await getEventWithUsers('event123');
console.log('Owner:', fullEvent.owner.name);
console.log('Participants:', fullEvent.participantDetails.map(p => p.name));
```

---

## 📱 Practical Examples

### Example 1: Display Event Owner in UI

```typescript
// In EventDetailScreen
const [ownerName, setOwnerName] = useState('');

useEffect(() => {
  const fetchOwner = async () => {
    const userDoc = await getDoc(doc(db, 'users', event.creatorId));
    const user = userDoc.data();
    setOwnerName(user.name);
  };
  
  fetchOwner();
}, [event.creatorId]);

// Display
<Text>Created by: {ownerName}</Text>
```

### Example 2: Display Participant Names

```typescript
// In EventDetailScreen
const [participantNames, setParticipantNames] = useState<string[]>([]);

useEffect(() => {
  const fetchParticipants = async () => {
    const names = await Promise.all(
      event.participants.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.data().name;
      })
    );
    setParticipantNames(names);
  };
  
  fetchParticipants();
}, [event.participants]);

// Display
<Text>Participants: {participantNames.join(', ')}</Text>
```

### Example 3: Check if User is Owner

```typescript
const currentUserId = '1'; // TODO: Get from auth
const isOwner = event.creatorId === currentUserId;

if (isOwner) {
  // Show "Cancel Event" button
} else {
  // Show "Join Event" button
}
```

---

## 🔍 Firebase Console Step-by-Step

### Finding Event Owner:

**Step 1:** Open Firebase Console
```
https://console.firebase.google.com/
```

**Step 2:** Select your project
```
eventbuddy-5c0bd
```

**Step 3:** Go to Firestore Database
```
Left sidebar → Firestore Database
```

**Step 4:** Open events collection
```
Click "events" collection
```

**Step 5:** Click on any event
```
Click on document ID (e.g., "Kx7mP2nQ8rT5vW9z")
```

**Step 6:** Find creatorId
```
Look for field: creatorId
Value: "1" (this is the owner's user ID)
```

**Step 7:** Go to users collection
```
Click back → Click "users" collection
```

**Step 8:** Open user document
```
Click on document "1"
```

**Step 9:** See owner info
```
name: "Demo User"
email: "demo@eventbuddy.com"
```

### Finding Participants:

**Step 1-5:** Same as above

**Step 6:** Find participants array
```
Look for field: participants
Value: ["1", "2", "3"] (array of user IDs)
```

**Step 7-9:** For each ID, look up in users collection
```
users/1 → Demo User
users/2 → John Doe
users/3 → Jane Smith
```

---

## 📊 Visual Representation

### Event Document:
```
events/event123
├── title: "Morning Basketball"
├── creatorId: "1" ──────────┐
├── participants: [          │
│   "1" ──────────────┐      │
│   "2" ──────────┐   │      │
│   "3" ──────┐   │   │      │
│ ]           │   │   │      │
└─────────────│───│───│──────│
              │   │   │      │
              ↓   ↓   ↓      ↓
         users/3  │   │  users/1 (Owner)
              users/2 │
                  users/1
```

### Lookup Process:
```
1. Read event document
2. Get creatorId: "1"
3. Get participants: ["1", "2", "3"]
4. For each ID, read users/{id}
5. Combine data
```

---

## 🛠️ Helper Service Functions

Let me create a service file with these helper functions:

```typescript
// src/services/userLookupService.ts

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Get event owner
export const getEventOwner = async (creatorId: string): Promise<User | null> => {
  return getUserById(creatorId);
};

// Get multiple users by IDs
export const getUsersByIds = async (userIds: string[]): Promise<User[]> => {
  try {
    const users = await Promise.all(
      userIds.map(id => getUserById(id))
    );
    return users.filter(user => user !== null) as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get event participants
export const getEventParticipants = async (participantIds: string[]): Promise<User[]> => {
  return getUsersByIds(participantIds);
};
```

---

## 💡 Best Practices

### Do:
- ✅ Cache user data to avoid repeated lookups
- ✅ Fetch user data when needed (lazy loading)
- ✅ Use Promise.all for multiple user lookups
- ✅ Handle missing users gracefully

### Don't:
- ❌ Fetch all users on every render
- ❌ Store full user objects in events
- ❌ Make separate requests for each user
- ❌ Ignore error handling

---

## 🎯 Common Use Cases

### 1. Show Event Owner Name
```typescript
const owner = await getUserById(event.creatorId);
<Text>Created by: {owner?.name}</Text>
```

### 2. Show Participant Count
```typescript
<Text>Participants: {event.participants.length}</Text>
```

### 3. Show Participant Names
```typescript
const participants = await getUsersByIds(event.participants);
<Text>{participants.map(p => p.name).join(', ')}</Text>
```

### 4. Check if User is Owner
```typescript
const isOwner = event.creatorId === currentUserId;
```

### 5. Check if User Joined
```typescript
const hasJoined = event.participants.includes(currentUserId);
```

---

## 📝 Summary

**To find event owner:**
1. Look at `creatorId` field in event
2. Look up that user ID in `users` collection
3. Get user's name and email

**To find participants:**
1. Look at `participants` array in event
2. For each user ID, look up in `users` collection
3. Get each user's name and email

**In Firebase Console:**
- events/{eventId} → creatorId → users/{creatorId}
- events/{eventId} → participants[] → users/{userId}

**In Code:**
- Use `getUserById()` for single user
- Use `getUsersByIds()` for multiple users
- Use `getEventOwner()` for event creator
- Use `getEventParticipants()` for all participants

Your data structure is already set up correctly! 🎉
