# Firebase Console Lookup Guide

## 🔍 How to Find Event Owners & Participants in Firebase Console

Step-by-step visual guide to finding user information in your Firestore database.

---

## 📊 Your Database Structure

```
Firestore Database
├── events/
│   ├── event1
│   │   ├── creatorId: "1"           ← Owner's ID
│   │   ├── participants: ["1","2"]  ← Participant IDs
│   │   └── ...
│   └── event2
│
└── users/
    ├── 1/
    │   ├── name: "Demo User"
    │   └── email: "demo@eventbuddy.com"
    └── 2/
        ├── name: "John Doe"
        └── email: "john@example.com"
```

---

## 🎯 Finding Event Owner

### Step 1: Open Firebase Console
```
URL: https://console.firebase.google.com/
```

### Step 2: Select Your Project
```
Click on: eventbuddy-5c0bd
```

### Step 3: Go to Firestore Database
```
Left sidebar → Firestore Database
```

### Step 4: View Events Collection
```
You'll see:
┌─────────────────────────────────┐
│ Firestore Database              │
├─────────────────────────────────┤
│ 📁 events (9 documents)         │
│ 📁 users (1 document)           │
└─────────────────────────────────┘

Click on "events"
```

### Step 5: Select an Event
```
You'll see list of events:
┌─────────────────────────────────┐
│ events                          │
├─────────────────────────────────┤
│ 📄 Kx7mP2nQ8rT5vW9z            │
│ 📄 Lm8nR3oS9uV6xY0a            │
│ 📄 Mn9oT4pU0wX7zB1c            │
└─────────────────────────────────┘

Click on any document ID
```

### Step 6: View Event Fields
```
You'll see:
┌─────────────────────────────────┐
│ Document: Kx7mP2nQ8rT5vW9z      │
├─────────────────────────────────┤
│ Field          Type     Value   │
├─────────────────────────────────┤
│ title          string   Morning │
│                         Basketball│
│ creatorId      string   1       │ ← This is the owner!
│ date           string   2025-12-01│
│ participants   array    [1, 2]  │
│ location       string   Central │
│                         Park    │
└─────────────────────────────────┘

Note the creatorId: "1"
```

### Step 7: Go to Users Collection
```
Click back arrow → Click "users" collection
```

### Step 8: Find Owner's User Document
```
You'll see:
┌─────────────────────────────────┐
│ users                           │
├─────────────────────────────────┤
│ 📄 1                            │ ← This is the owner!
└─────────────────────────────────┘

Click on document "1"
```

### Step 9: View Owner's Information
```
You'll see:
┌─────────────────────────────────┐
│ Document: 1                     │
├─────────────────────────────────┤
│ Field          Type     Value   │
├─────────────────────────────────┤
│ name           string   Demo User│ ← Owner's name
│ email          string   demo@   │ ← Owner's email
│                         eventbuddy│
│                         .com    │
│ createdAt      timestamp ...    │
└─────────────────────────────────┘

This is the event owner!
```

---

## 👥 Finding Event Participants

### Steps 1-6: Same as above (get to event document)

### Step 7: Look at Participants Array
```
In the event document:
┌─────────────────────────────────┐
│ Field          Type     Value   │
├─────────────────────────────────┤
│ participants   array    [       │
│                         0: "1"  │ ← First participant
│                         1: "2"  │ ← Second participant
│                         2: "3"  │ ← Third participant
│                         ]       │
└─────────────────────────────────┘

Note all the user IDs: "1", "2", "3"
```

### Step 8: Look Up Each Participant

**For participant "1":**
```
Go to users collection → Click document "1"
┌─────────────────────────────────┐
│ Document: 1                     │
├─────────────────────────────────┤
│ name: Demo User                 │
│ email: demo@eventbuddy.com      │
└─────────────────────────────────┘
```

**For participant "2":**
```
Go to users collection → Click document "2"
┌─────────────────────────────────┐
│ Document: 2                     │
├─────────────────────────────────┤
│ name: John Doe                  │
│ email: john@example.com         │
└─────────────────────────────────┘
```

**For participant "3":**
```
Go to users collection → Click document "3"
┌─────────────────────────────────┐
│ Document: 3                     │
├─────────────────────────────────┤
│ name: Jane Smith                │
│ email: jane@example.com         │
└─────────────────────────────────┘
```

---

## 🔎 Quick Reference

### To Find Event Owner:
```
1. events/{eventId}
2. Look at "creatorId" field
3. Go to users/{creatorId}
4. See owner's name and email
```

### To Find Participants:
```
1. events/{eventId}
2. Look at "participants" array
3. For each ID in array:
   - Go to users/{userId}
   - See participant's name and email
```

---

## 📱 Example Walkthrough

### Example Event:
```
Event: "Morning Basketball"
Document ID: Kx7mP2nQ8rT5vW9z
```

### Finding Owner:
```
Step 1: Open events/Kx7mP2nQ8rT5vW9z
Step 2: See creatorId: "1"
Step 3: Open users/1
Step 4: See name: "Demo User"
Result: Owner is Demo User
```

### Finding Participants:
```
Step 1: Open events/Kx7mP2nQ8rT5vW9z
Step 2: See participants: ["1", "2"]
Step 3: Open users/1 → Demo User
Step 4: Open users/2 → John Doe
Result: Participants are Demo User and John Doe
```

---

## 🎨 Visual Flow Diagram

```
Firebase Console
    ↓
Select Project (eventbuddy-5c0bd)
    ↓
Firestore Database
    ↓
┌─────────────────────────────────┐
│ Collections:                    │
│ • events                        │
│ • users                         │
└─────────────────────────────────┘
    ↓
Click "events"
    ↓
┌─────────────────────────────────┐
│ Event Documents:                │
│ • Kx7mP2nQ8rT5vW9z             │
│ • Lm8nR3oS9uV6xY0a             │
└─────────────────────────────────┘
    ↓
Click event document
    ↓
┌─────────────────────────────────┐
│ Event Fields:                   │
│ • creatorId: "1" ───────┐      │
│ • participants: ["1","2"]│      │
└─────────────────────────│───────┘
                          ↓
                    Go to users/1
                          ↓
┌─────────────────────────────────┐
│ User Document:                  │
│ • name: "Demo User"             │
│ • email: "demo@eventbuddy.com"  │
└─────────────────────────────────┘
```

---

## 💡 Tips & Tricks

### Tip 1: Use Browser Search
```
Press Ctrl+F (or Cmd+F on Mac)
Search for user ID in users collection
Quickly find the user document
```

### Tip 2: Keep Multiple Tabs Open
```
Tab 1: Event document
Tab 2: Users collection
Switch between tabs to look up users
```

### Tip 3: Use Document Path
```
Direct URL format:
https://console.firebase.google.com/project/eventbuddy-5c0bd/firestore/data/~2Fevents~2F{eventId}

Replace {eventId} with actual ID
```

### Tip 4: Export Data
```
Click "..." menu → Export collection
Download as JSON
Search in text editor
```

---

## 🔍 Advanced Queries in Console

### Filter Events by Creator:
```
1. Go to events collection
2. Click "Filter" button
3. Add filter:
   Field: creatorId
   Operator: ==
   Value: 1
4. Click "Apply"
5. See all events created by user "1"
```

### Filter Events by Participant:
```
1. Go to events collection
2. Click "Filter" button
3. Add filter:
   Field: participants
   Operator: array-contains
   Value: 1
4. Click "Apply"
5. See all events where user "1" is a participant
```

---

## 📊 Sample Data Reference

### Your Current Data:

**User 1 (Demo User):**
```
users/1
├── name: "Demo User"
└── email: "demo@eventbuddy.com"
```

**Events created by User 1:**
```
Look for events where creatorId == "1"
```

**Events joined by User 1:**
```
Look for events where participants contains "1"
```

---

## ❓ Common Questions

**Q: How do I see all events a user created?**
A: Filter events collection by `creatorId == userId`

**Q: How do I see all events a user joined?**
A: Filter events collection by `participants array-contains userId`

**Q: Can I see participant names directly in the event?**
A: No, you need to look up each user ID in the users collection

**Q: Why not store user names in events?**
A: To avoid data duplication and keep data consistent (see DATA_DESIGN_EXPLANATION.md)

**Q: How do I find a user by email?**
A: Go to users collection, manually search, or use filter: `email == "user@example.com"`

---

## 📝 Summary

**To find event owner in Firebase Console:**
1. Open event document
2. Note the `creatorId` value
3. Go to users collection
4. Open user document with that ID
5. See owner's name and email

**To find participants:**
1. Open event document
2. Note the `participants` array values
3. For each user ID:
   - Go to users collection
   - Open user document with that ID
   - See participant's name and email

**Quick path:**
```
events/{eventId} → creatorId → users/{creatorId}
events/{eventId} → participants[] → users/{userId}
```

Your data is organized efficiently! 🎉
