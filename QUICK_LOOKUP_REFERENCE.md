# Quick Lookup Reference Card

## 🔍 Finding Owners & Participants - Cheat Sheet

---

## 📊 Data Structure

```
Event Document:
├── creatorId: "1"           ← Owner's user ID
└── participants: ["1","2"]  ← Participant user IDs

User Document:
├── name: "Demo User"
└── email: "demo@eventbuddy.com"
```

---

## 🎯 In Firebase Console

### Find Event Owner:
```
1. events/{eventId} → creatorId field
2. users/{creatorId} → name & email
```

### Find Participants:
```
1. events/{eventId} → participants array
2. For each ID: users/{userId} → name & email
```

---

## 💻 In Code

### Get Owner:
```typescript
import { getUserById } from '../services/userLookupService';

const owner = await getUserById(event.creatorId);
console.log(owner.name); // "Demo User"
```

### Get Participants:
```typescript
import { getUsersByIds } from '../services/userLookupService';

const participants = await getUsersByIds(event.participants);
participants.forEach(p => console.log(p.name));
```

### Get Event with Full Details:
```typescript
import { getEventWithUserDetails } from '../services/userLookupService';

const fullEvent = await getEventWithUserDetails(event);
console.log('Owner:', fullEvent.ownerDetails.name);
console.log('Participants:', fullEvent.participantDetails);
```

---

## 🔎 Queries

### Find Events by Creator:
```typescript
import { getEventsByCreator } from '../services/userLookupService';

const myEvents = await getEventsByCreator('1');
console.log(`Created ${myEvents.length} events`);
```

### Find Events by Participant:
```typescript
import { getEventsByParticipant } from '../services/userLookupService';

const joinedEvents = await getEventsByParticipant('1');
console.log(`Joined ${joinedEvents.length} events`);
```

---

## 📱 Example Usage

### Display Owner Name:
```typescript
const [ownerName, setOwnerName] = useState('');

useEffect(() => {
  getUserById(event.creatorId).then(user => {
    setOwnerName(user?.name || 'Unknown');
  });
}, [event.creatorId]);

<Text>Created by: {ownerName}</Text>
```

### Display Participant List:
```typescript
const [participants, setParticipants] = useState<User[]>([]);

useEffect(() => {
  getUsersByIds(event.participants).then(setParticipants);
}, [event.participants]);

{participants.map(p => (
  <Text key={p.id}>{p.name}</Text>
))}
```

---

## ✅ Quick Checks

### Is User the Owner?
```typescript
const isOwner = event.creatorId === currentUserId;
```

### Has User Joined?
```typescript
const hasJoined = event.participants.includes(currentUserId);
```

### Participant Count:
```typescript
const count = event.participants.length;
```

---

## 📝 Files Reference

- **Helper Functions:** `src/services/userLookupService.ts`
- **Detailed Guide:** `FIRESTORE_QUERIES_GUIDE.md`
- **Console Guide:** `FIREBASE_CONSOLE_LOOKUP_GUIDE.md`
- **Data Design:** `DATA_DESIGN_EXPLANATION.md`

---

## 🎯 Remember

- Events store **user IDs** (not full user objects)
- Look up user details **when needed**
- Use **helper functions** for common lookups
- **Cache** user data to avoid repeated queries

---

Quick and easy! 🚀
