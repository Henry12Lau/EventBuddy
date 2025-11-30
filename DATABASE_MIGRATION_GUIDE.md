# Database Migration Guide

## 🔄 Updating Your Firestore Database

Your existing events need the new `isActive` field. Here's how to update them.

---

## 🎯 Quick Start (Easiest Method)

### Step 1: Restart Your App
```bash
npm start
```

### Step 2: Go to Admin Tab
- Open your app
- Click the **Admin** tab (⚙️) at the bottom

### Step 3: Click "Migrate Events to isActive"
- You'll see a new blue button at the top
- Click **"Migrate Events to isActive"**
- Wait for success message

### Step 4: Done!
```
Migration completed!

Updated: 9 events
Skipped: 0 events
Total: 9 events
```

All your existing events now have `isActive: true`! ✅

---

## 📊 What the Migration Does

### Before Migration:
```javascript
events/event1
  ├── title: "Morning Basketball"
  ├── date: "2025-12-01"
  ├── participants: ["1", "2"]
  └── creatorId: "1"
  // ❌ No isActive field
```

### After Migration:
```javascript
events/event1
  ├── title: "Morning Basketball"
  ├── date: "2025-12-01"
  ├── participants: ["1", "2"]
  ├── creatorId: "1"
  └── isActive: true  // ✅ Added!
```

---

## 🔐 Is It Safe?

### ✅ Yes, completely safe!

**Why:**
- Only adds `isActive: true` to events
- Doesn't delete or modify existing data
- Safe to run multiple times
- Skips events that already have the field
- Non-destructive operation

**What it does:**
1. Reads all events from Firestore
2. Checks if `isActive` field exists
3. If missing, adds `isActive: true`
4. If exists, skips that event
5. Reports how many were updated

---

## 📱 Step-by-Step with Screenshots

### 1. Open Admin Tab
```
Bottom Navigation:
[🎯 Events] [📅 Schedule] [👤 Profile] [⚙️ Admin] ← Click here
```

### 2. See Migration Card
```
┌─────────────────────────────────────┐
│ 🔄 Migrate Database                 │
│                                     │
│ Add isActive field to existing      │
│ events:                             │
│ • Updates all events in Firestore   │
│ • Sets isActive: true for all       │
│ • Safe to run multiple times        │
│                                     │
│ Run this ONCE after updating app!   │
│                                     │
│ [Migrate Events to isActive]        │
└─────────────────────────────────────┘
```

### 3. Click Button
- Button turns gray
- Shows "Migrating..."
- Takes 2-5 seconds

### 4. Success Message
```
Migration completed!

Updated: 9 events
Skipped: 0 events
Total: 9 events

[OK]
```

---

## 🧪 Verify Migration

### Method 1: Check Firebase Console
1. Go to Firebase Console
2. Click Firestore Database
3. Open any event document
4. ✅ Should see `isActive: true` field

### Method 2: Check in App
1. Go to Events tab
2. Create a new event
3. Cancel it
4. ✅ Should see "CANCELLED" overlay
5. Works! Migration successful

---

## 🔄 Running Multiple Times

**It's safe to run the migration multiple times!**

### First Run:
```
Migration completed!

Updated: 9 events    ← All events updated
Skipped: 0 events
Total: 9 events
```

### Second Run:
```
Migration completed!

Updated: 0 events    ← Nothing to update
Skipped: 9 events    ← All already have field
Total: 9 events
```

The migration is **idempotent** - running it multiple times has the same effect as running it once.

---

## 🛠️ Alternative Methods

### Method 1: Using Admin Screen (Recommended)
✅ Easiest
✅ One-click solution
✅ Visual feedback
✅ No coding needed

### Method 2: Manual in Firebase Console
1. Go to Firebase Console
2. Open Firestore Database
3. Click on each event document
4. Click "Add field"
5. Field: `isActive`, Type: boolean, Value: true
6. Click "Update"
7. Repeat for all events

❌ Time-consuming
❌ Error-prone
❌ Not recommended for many events

### Method 3: Using Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Run migration script (advanced)
firebase firestore:update events --set isActive=true
```

❌ Requires CLI setup
❌ More complex
❌ Only for advanced users

---

## 📊 Migration Script Details

### What the Script Does:
```typescript
// src/services/migrateEvents.ts

export const migrateEventsToIsActive = async () => {
  // 1. Get all events from Firestore
  const eventsCollection = collection(db, 'events');
  const querySnapshot = await getDocs(eventsCollection);
  
  // 2. Loop through each event
  for (const eventDoc of querySnapshot.docs) {
    const eventData = eventDoc.data();
    
    // 3. Check if isActive already exists
    if (eventData.isActive !== undefined) {
      // Skip - already migrated
      continue;
    }
    
    // 4. Add isActive: true
    await updateDoc(doc(db, 'events', eventDoc.id), {
      isActive: true
    });
  }
  
  // 5. Return results
  return { updated, skipped, total };
};
```

---

## ❓ Troubleshooting

### Issue 1: "Migration failed" error

**Cause:** Firestore not accessible or network issue

**Solution:**
1. Check internet connection
2. Verify Firestore is enabled
3. Check security rules allow write
4. Try again

---

### Issue 2: Button doesn't appear

**Cause:** App not restarted after code update

**Solution:**
1. Stop app (Ctrl+C)
2. Run `npm start` again
3. Refresh browser/reload app
4. Check Admin tab again

---

### Issue 3: "Updated: 0 events"

**Cause:** Events already migrated

**Solution:**
- This is normal!
- All events already have `isActive` field
- No action needed

---

### Issue 4: Some events not updated

**Cause:** Partial migration or error

**Solution:**
1. Run migration again
2. Check Firebase Console
3. Manually add field to missing events
4. Contact support if persists

---

## 🎯 When to Run Migration

### Run Migration If:
- ✅ You have existing events in Firestore
- ✅ You just updated your app code
- ✅ Events don't have `isActive` field
- ✅ Cancel feature not working

### Don't Need Migration If:
- ❌ Fresh install (no existing events)
- ❌ Already ran migration successfully
- ❌ All events created after update

---

## 📝 Migration Checklist

Before running migration:
- [ ] App is updated to latest code
- [ ] Firestore is enabled
- [ ] Internet connection is stable
- [ ] Security rules allow write access

After running migration:
- [ ] Success message received
- [ ] Check Firebase Console
- [ ] Verify `isActive` field exists
- [ ] Test cancel feature
- [ ] All events display correctly

---

## 🔮 Future Migrations

If you need to migrate other fields in the future, you can:

1. **Create new migration function** in `src/services/migrateEvents.ts`
2. **Add button** to Admin screen
3. **Run migration** once
4. **Verify** in Firebase Console

Example:
```typescript
export const migrateAddNewField = async () => {
  // Similar pattern to migrateEventsToIsActive
  // Add your new field to all events
};
```

---

## 💡 Best Practices

### Do:
- ✅ Run migration once after code update
- ✅ Verify in Firebase Console
- ✅ Test cancel feature after migration
- ✅ Keep migration script for reference

### Don't:
- ❌ Run migration repeatedly (unless needed)
- ❌ Modify migration script unless you know what you're doing
- ❌ Delete migration script (keep for future reference)
- ❌ Manually edit all events (use migration instead)

---

## 📊 Expected Results

### For 9 Sample Events:
```
Before Migration:
├── 9 events without isActive field
└── Cancel feature doesn't work

After Migration:
├── 9 events with isActive: true
├── Cancel feature works
└── Cancelled events show overlay
```

### For Your Events:
```
Before Migration:
├── X events without isActive field
└── Cancel feature doesn't work

After Migration:
├── X events with isActive: true
├── Cancel feature works
└── Cancelled events show overlay
```

---

## 🎉 Summary

**To update your database:**

1. **Open app** → Go to Admin tab
2. **Click** "Migrate Events to isActive"
3. **Wait** for success message
4. **Done!** All events updated

**What happens:**
- All existing events get `isActive: true`
- Cancel feature starts working
- Cancelled events show overlay
- No data lost or modified

**Time required:** 30 seconds

**Difficulty:** Easy (one-click)

**Safety:** 100% safe

Your database is now ready for the new cancel feature! 🚀
