# Firestore Data Structure Recommendation

Based on your EventBuddy app analysis, here's the recommended Firestore database structure:

## 📊 Current App Features

Your app has:
- ✅ **Events**: Browse, create, join events
- ✅ **Schedule**: View user's active/archived events
- ✅ **Chat**: Event-specific messaging
- ✅ **Profile**: User information and preferences

## 🗄️ Recommended Firestore Collections

### 1. **users** Collection
Store user profiles and preferences.

```javascript
users/{userId}
  ├── id: string (same as document ID)
  ├── name: string
  ├── email: string
  ├── avatar: string (URL or null)
  ├── sports: string[] (favorite sports)
  ├── skillLevel: string ("Beginner" | "Intermediate" | "Advanced")
  ├── createdAt: timestamp
  ├── updatedAt: timestamp
  └── settings: {
      ├── notifications: boolean
      └── emailUpdates: boolean
  }
```

**Why?**
- User profiles for authentication
- Display user info in events and chats
- Personalized recommendations based on sports preferences

---

### 2. **events** Collection ✅ (Already Implemented)
Store all event information.

```javascript
events/{eventId}
  ├── id: string (auto-generated)
  ├── title: string
  ├── sport: string
  ├── description: string (optional, detailed info)
  ├── date: string (YYYY-MM-DD)
  ├── time: string (HH:MM)
  ├── endTime: string (HH:MM)
  ├── location: string
  ├── locationCoords: { (optional, for maps)
  │   ├── latitude: number
  │   └── longitude: number
  │ }
  ├── maxParticipants: number
  ├── participants: string[] (array of user IDs)
  ├── creatorId: string (user ID)
  ├── status: string ("active" | "cancelled" | "completed")
  ├── createdAt: timestamp
  └── updatedAt: timestamp
```

**Why?**
- Central event data
- Easy to query by date, sport, location
- Track event lifecycle (active/cancelled/completed)

---

### 3. **messages** Collection
Store chat messages for each event.

```javascript
messages/{messageId}
  ├── id: string (auto-generated)
  ├── eventId: string (reference to event)
  ├── userId: string (sender ID)
  ├── userName: string (sender name, denormalized for performance)
  ├── userAvatar: string (sender avatar, optional)
  ├── text: string
  ├── timestamp: timestamp
  └── type: string ("text" | "system") // system for "User joined event"
```

**Why?**
- Separate collection for better scalability
- Easy to query messages by eventId
- Real-time chat with Firestore listeners
- Can add system messages (e.g., "John joined the event")

**Query Example:**
```javascript
// Get messages for an event
const messagesQuery = query(
  collection(db, 'messages'),
  where('eventId', '==', eventId),
  orderBy('timestamp', 'asc'),
  limit(50)
);
```

---

### 4. **notifications** Collection (Future Enhancement)
Store user notifications.

```javascript
notifications/{notificationId}
  ├── id: string
  ├── userId: string (recipient)
  ├── type: string ("event_reminder" | "new_message" | "event_update")
  ├── eventId: string (optional, related event)
  ├── title: string
  ├── message: string
  ├── read: boolean
  ├── createdAt: timestamp
  └── actionUrl: string (optional, deep link)
```

**Why?**
- Event reminders (1 day before, 1 hour before)
- New message notifications
- Event updates (cancelled, time changed)

---

### 5. **eventParticipants** Subcollection (Alternative Approach)
If you expect many participants per event, use a subcollection instead of an array.

```javascript
events/{eventId}/participants/{userId}
  ├── userId: string
  ├── userName: string (denormalized)
  ├── joinedAt: timestamp
  └── status: string ("confirmed" | "maybe" | "declined")
```

**Why?**
- Better for events with 100+ participants
- Avoid document size limits (1MB per document)
- More flexible queries

---

## 📈 Data Relationships

```
User (1) ──creates──> (many) Events
User (many) ──joins──> (many) Events
Event (1) ──has──> (many) Messages
User (1) ──sends──> (many) Messages
Event (1) ──has──> (many) Notifications
```

---

## 🔍 Recommended Indexes

Create these composite indexes in Firebase Console for better query performance:

1. **Events by date and sport:**
   - Collection: `events`
   - Fields: `date` (Ascending), `sport` (Ascending)

2. **Messages by event and time:**
   - Collection: `messages`
   - Fields: `eventId` (Ascending), `timestamp` (Ascending)

3. **User's events (if using subcollection):**
   - Collection: `events/{eventId}/participants`
   - Fields: `userId` (Ascending), `joinedAt` (Descending)

---

## 🎯 What to Store First (Priority Order)

### Phase 1: Core Features (Do This Now) ✅
1. **events** - Already implemented!
2. **messages** - Enable chat functionality
3. **users** - User profiles and authentication

### Phase 2: Enhanced Features
4. **notifications** - Event reminders
5. **eventParticipants** subcollection - If scaling to large events

---

## 💾 Data Denormalization Strategy

For better performance, denormalize these fields:

### In Events:
```javascript
{
  creatorId: "user123",
  creatorName: "John Doe", // Denormalized
  creatorAvatar: "https://..." // Denormalized
}
```

### In Messages:
```javascript
{
  userId: "user123",
  userName: "John Doe", // Denormalized
  userAvatar: "https://..." // Denormalized
}
```

**Why?**
- Avoid extra reads to fetch user data
- Faster UI rendering
- Trade-off: Need to update when user changes name/avatar

---

## 🔐 Security Rules Recommendation

### Development (Current):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production (Recommended):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read all users, but only update their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read events, authenticated users can create
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && 
                      resource.data.creatorId == request.auth.uid;
    }
    
    // Messages: read if participant, write if authenticated
    match /messages/{messageId} {
      allow read: if true; // Or check if user is event participant
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              resource.data.userId == request.auth.uid;
    }
    
    // Notifications: only owner can read/write
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📊 Storage Estimates

For 1000 active users:

| Collection | Documents | Avg Size | Total |
|------------|-----------|----------|-------|
| users | 1,000 | 1 KB | 1 MB |
| events | 5,000 | 2 KB | 10 MB |
| messages | 50,000 | 0.5 KB | 25 MB |
| notifications | 10,000 | 0.5 KB | 5 MB |
| **Total** | **66,000** | - | **~41 MB** |

**Firestore Free Tier:**
- 1 GB storage (plenty!)
- 50K reads/day
- 20K writes/day
- 20K deletes/day

---

## 🚀 Next Steps

1. **Implement Messages Collection** (highest priority)
   - Enable real-time chat
   - Better than storing in local state

2. **Implement Users Collection**
   - Add Firebase Authentication
   - Store user profiles

3. **Add Real-time Listeners**
   - Live event updates
   - Real-time chat messages

4. **Implement Notifications**
   - Event reminders
   - New message alerts

Would you like me to implement any of these collections?
