# Firestore Setup Guide - Step by Step

## 🎯 Good News!

**You DON'T need to manually create tables (collections) in Firestore!**

Collections are automatically created when you add the first document. Your app will create them automatically when you:
- Seed data (creates `events` and `users` collections)
- Create an event (creates `events` collection if it doesn't exist)
- Save profile (creates `users` collection if it doesn't exist)

---

## 📋 Complete Setup Steps

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **eventbuddy-5c0bd**
3. Click **"Firestore Database"** in the left sidebar
4. Click **"Create database"** button

   ![Create Database Button](https://via.placeholder.com/400x100/4285F4/FFFFFF?text=Create+Database)

5. Choose **"Start in test mode"**
   ```
   ○ Start in production mode
   ● Start in test mode  ← Choose this
   ```

6. Click **"Next"**

7. Select a location (closest to your users):
   ```
   Recommended:
   - us-central (United States)
   - asia-southeast1 (Singapore)
   - europe-west1 (Belgium)
   ```

8. Click **"Enable"**

9. Wait 30-60 seconds for Firestore to initialize

✅ **Done!** Firestore is now enabled.

---

### Step 2: Set Security Rules

1. In Firebase Console, stay in **Firestore Database**
2. Click the **"Rules"** tab at the top
3. You'll see default rules like this:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

4. **Replace** all the rules with this (for testing):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read and write for all collections during testing
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

5. Click **"Publish"** button

6. You'll see a warning: "Your security rules are defined as public..."
   - This is OK for testing
   - Click **"Publish"** again to confirm

✅ **Done!** Security rules are set.

---

### Step 3: Verify Firestore is Ready

1. In Firebase Console, go to **Firestore Database**
2. Click the **"Data"** tab
3. You should see an empty database:
   ```
   No collections yet
   
   Collections will appear here after you add data
   ```

✅ **Done!** Firestore is ready to receive data.

---

### Step 4: Run Your App

1. Open terminal in your project folder
2. Run:
   ```bash
   npm start
   ```

3. Open your app in browser or simulator

✅ **Done!** App is running.

---

### Step 5: Seed Data (Creates Collections Automatically)

1. In your app, go to the **Admin** tab (⚙️ icon at bottom)

2. Click **"Seed Sample Data"** button

3. Wait for success message:
   ```
   Successfully seeded:
   - 1 sample user (Demo User)
   - 9 events to Firestore!
   ```

4. **This automatically creates:**
   - ✅ `users` collection with 1 document
   - ✅ `events` collection with 9 documents

✅ **Done!** Collections are created with data.

---

### Step 6: Verify Data in Firebase Console

1. Go back to Firebase Console → Firestore Database → Data tab

2. You should now see:
   ```
   Firestore Database
   ├── events (9 documents)
   └── users (1 document)
   ```

3. Click on **events** to see all event documents:
   ```
   events
   ├── Kx7mP2nQ8rT5vW9z
   ├── Lm8nR3oS9uV6xY0a
   ├── Mn9oT4pU0wX7zB1c
   └── ... (9 total)
   ```

4. Click on any document to see its fields:
   ```
   Document: Kx7mP2nQ8rT5vW9z
   ├── title: "Morning Basketball"
   ├── sport: "Basketball"
   ├── date: "2025-12-01"
   ├── time: "09:00"
   ├── endTime: "11:00"
   ├── location: "Central Park"
   ├── maxParticipants: 10
   ├── participants: ["1", "2"]
   ├── creatorId: "1"
   └── createdAt: December 1, 2024 at 10:30:00 AM
   ```

5. Click on **users** to see user document:
   ```
   users
   └── 1
       ├── name: "Demo User"
       ├── email: "demo@eventbuddy.com"
       ├── createdAt: (timestamp)
       └── updatedAt: (timestamp)
   ```

✅ **Done!** Data is verified in Firestore.

---

## 🎉 That's It!

Your Firestore database is now:
- ✅ Enabled
- ✅ Configured with test rules
- ✅ Populated with sample data
- ✅ Ready to use

---

## 🔄 How Collections Are Created

### Automatic Creation (Recommended)
When your app runs this code:
```typescript
await addDoc(collection(db, 'events'), eventData);
```
Firestore automatically:
1. Creates the `events` collection (if it doesn't exist)
2. Adds the document
3. Generates a unique ID

### Manual Creation (Not Needed, But Possible)
If you want to manually create a collection:

1. Go to Firebase Console → Firestore Database
2. Click **"Start collection"**
3. Enter collection ID: `events`
4. Add a sample document:
   - Field: `title`, Type: string, Value: "Test Event"
   - Field: `date`, Type: string, Value: "2025-12-01"
5. Click **"Save"**

**But you don't need to do this!** Your app creates collections automatically.

---

## 📊 What Collections Will Be Created

When you use your app, these collections are created automatically:

### 1. `events` Collection
**Created when:**
- You seed data (Admin tab)
- You create your first event (Create Event screen)

**Contains:**
- Event documents with all event details

### 2. `users` Collection
**Created when:**
- You seed data (Admin tab)
- You save profile for the first time (Profile screen)

**Contains:**
- User profile documents

### 3. `messages` Collection (Future)
**Will be created when:**
- You implement chat persistence
- Someone sends the first message

**Will contain:**
- Chat message documents

---

## 🔍 Viewing Your Data

### In Firebase Console:
1. Go to Firestore Database → Data tab
2. Click on collection name (e.g., `events`)
3. Click on document ID to see fields
4. You can edit, delete, or add documents manually here

### In Your App:
1. **Events tab**: Browse all events
2. **Profile tab**: View/edit user profile
3. **Schedule tab**: View your joined events
4. **Admin tab**: Seed more data if needed

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Permission denied" error
**Cause:** Security rules not set correctly

**Solution:**
1. Go to Firestore Database → Rules
2. Make sure you have:
   ```javascript
   allow read, write: if true;
   ```
3. Click "Publish"

---

### Issue 2: "Firestore is not enabled"
**Cause:** Firestore database not created

**Solution:**
1. Go to Firestore Database
2. Click "Create database"
3. Follow Step 1 above

---

### Issue 3: Collections not appearing
**Cause:** No data has been added yet

**Solution:**
1. Go to Admin tab in your app
2. Click "Seed Sample Data"
3. Refresh Firebase Console

---

### Issue 4: "Failed to seed data"
**Cause:** Firebase config incorrect or Firestore not enabled

**Solution:**
1. Check `.env` file has correct Firebase credentials
2. Verify Firestore is enabled in Firebase Console
3. Check browser console for detailed error

---

## 🔐 Security Rules Explained

### Test Mode (Current):
```javascript
allow read, write: if true;
```
- ✅ Anyone can read/write
- ✅ Good for development
- ⚠️ NOT secure for production

### Production Mode (Future):
```javascript
allow read: if true;
allow write: if request.auth != null;
```
- ✅ Anyone can read
- ✅ Only authenticated users can write
- ✅ Secure for production

---

## 📝 Summary

### What You Need to Do:
1. ✅ Enable Firestore in Firebase Console
2. ✅ Set security rules to test mode
3. ✅ Run your app
4. ✅ Seed data from Admin tab

### What Happens Automatically:
1. ✅ Collections are created when you add data
2. ✅ Document IDs are auto-generated
3. ✅ Timestamps are auto-added
4. ✅ Data is synced to cloud

### What You DON'T Need to Do:
- ❌ Manually create collections
- ❌ Define schemas
- ❌ Create tables
- ❌ Set up indexes (for now)

---

## 🎯 Next Steps

After setup is complete:

1. **Test Events**: Create a new event in your app
2. **Test Profile**: Edit and save your profile
3. **Verify Data**: Check Firebase Console to see new data
4. **Test Join**: Join an event and see participants update

---

## 💡 Pro Tips

1. **Bookmark Firebase Console**: You'll check it often
2. **Keep Console Open**: Watch data update in real-time
3. **Use Admin Tab**: Easy way to reset/seed data
4. **Check Browser Console**: Shows detailed errors
5. **Refresh Console**: Click refresh icon to see latest data

---

## ❓ Need Help?

If something doesn't work:

1. Check browser console for errors (F12)
2. Verify Firebase config in `.env` file
3. Make sure Firestore is enabled
4. Check security rules are published
5. Try seeding data again

---

## ✅ Checklist

Before using your app, make sure:

- [ ] Firestore is enabled in Firebase Console
- [ ] Security rules are set to test mode
- [ ] Rules are published
- [ ] `.env` file has correct Firebase config
- [ ] App is running (`npm start`)
- [ ] Data is seeded (Admin tab)
- [ ] Collections appear in Firebase Console

If all checked, you're ready to go! 🚀
