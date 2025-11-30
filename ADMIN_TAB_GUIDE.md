# Admin Tab Guide

## ✅ Admin Tab Added!

The Admin tab has been added to your bottom navigation bar.

---

## 📍 Where to Find It

After restarting your app, you should see **4 tabs** at the bottom:

```
┌─────────┬─────────┬─────────┬─────────┐
│  🎯     │  📅     │  👤     │  ⚙️     │
│ Events  │Schedule │ Profile │ Admin   │
└─────────┴─────────┴─────────┴─────────┘
```

The **Admin** tab (⚙️) is on the far right.

---

## 🔄 If You Don't See It

### Step 1: Restart Your App

**For Web:**
1. Stop the server (Ctrl+C in terminal)
2. Run `npm start` again
3. Refresh your browser (Cmd+R or Ctrl+R)

**For iOS Simulator:**
1. Stop the app
2. Run `npm start` again
3. Press `i` to open iOS simulator

**For Android:**
1. Stop the app
2. Run `npm start` again
3. Press `a` to open Android emulator

### Step 2: Clear Cache (If Still Not Showing)

**For Expo:**
```bash
# Stop the app first (Ctrl+C)

# Clear cache and restart
npm start -- --clear
```

**For React Native:**
```bash
# Clear cache
npx react-native start --reset-cache
```

### Step 3: Verify Files Exist

Make sure these files exist:
- ✅ `src/screens/AdminScreen.tsx`
- ✅ `src/navigation/AppNavigator.tsx` (updated)

---

## 🎯 What the Admin Tab Does

The Admin tab provides tools for managing your app data:

### 🌱 Seed Database Button
- Creates sample user (Demo User)
- Creates 9 sample events
- One-click data population
- Only needs to be done once

### ℹ️ Instructions Card
- Setup checklist
- Quick reference guide

### 👤 Sample User Info
- Shows what user will be created
- Displays default credentials

---

## 🚀 Using the Admin Tab

### First Time Setup:

1. **Open Admin Tab**
   - Click the ⚙️ icon at the bottom

2. **Read Instructions**
   - Make sure Firestore is enabled
   - Verify security rules are set

3. **Click "Seed Sample Data"**
   - Wait for success message
   - Should take 2-3 seconds

4. **Verify Data**
   - Go to Events tab → See 9 events
   - Go to Profile tab → See Demo User
   - Check Firebase Console → See collections

### After Setup:

You can:
- ✅ Seed data again (adds more events)
- ✅ Use it as a quick reset
- ✅ Remove the tab if you don't need it

---

## 🗑️ Removing Admin Tab (Optional)

If you want to remove the Admin tab after seeding data:

1. Open `src/navigation/AppNavigator.tsx`

2. Remove the import:
```typescript
import AdminScreen from '../screens/AdminScreen';  // DELETE THIS LINE
```

3. Remove the tab:
```typescript
<Tab.Screen 
  name="Admin" 
  component={AdminScreen} 
  options={{ 
    title: 'Admin Tools',
    tabBarLabel: 'Admin',
    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size }}>⚙️</Text>
  }} 
/>
// DELETE THE ENTIRE BLOCK ABOVE
```

4. Restart your app

---

## 🎨 Admin Screen Features

### Seed Database Card
```
┌─────────────────────────────────┐
│ 🌱 Seed Database                │
│                                 │
│ Populate Firestore with sample │
│ data:                           │
│ • 1 demo user profile           │
│ • 9 sample events               │
│                                 │
│ Only do this once!              │
│                                 │
│ [Seed Sample Data]              │
└─────────────────────────────────┘
```

### Instructions Card
```
┌─────────────────────────────────┐
│ ℹ️ Instructions                 │
│                                 │
│ 1. Enable Firestore             │
│ 2. Set security rules           │
│ 3. Click "Seed Sample Data"     │
│ 4. Check Firebase Console       │
│ 5. Go to Events/Profile tabs    │
└─────────────────────────────────┘
```

### Sample User Card
```
┌─────────────────────────────────┐
│ 👤 Sample User                  │
│                                 │
│ Name: Demo User                 │
│ Email: demo@eventbuddy.com      │
│                                 │
│ You can edit this in Profile!   │
└─────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Issue: "Seeding..." never completes

**Cause:** Firestore not enabled or network issue

**Solution:**
1. Check Firebase Console → Firestore is enabled
2. Check internet connection
3. Check browser console for errors (F12)
4. Verify `.env` file has correct Firebase config

---

### Issue: "Failed to seed data" error

**Cause:** Security rules not set or Firebase config wrong

**Solution:**
1. Go to Firestore → Rules
2. Make sure rules allow write:
   ```javascript
   allow read, write: if true;
   ```
3. Click "Publish"
4. Try seeding again

---

### Issue: Success message but no data in Firebase Console

**Cause:** Looking at wrong project or data not synced

**Solution:**
1. Verify you're in the correct Firebase project
2. Click refresh icon in Firebase Console
3. Check the "Data" tab (not "Rules" tab)
4. Wait a few seconds and refresh again

---

### Issue: Can seed multiple times, creates duplicates

**Cause:** This is expected behavior

**Solution:**
- Seeding adds new documents each time
- To avoid duplicates, only seed once
- Or manually delete old data in Firebase Console

---

## 📱 Alternative: Seed Without Admin Tab

If you can't see the Admin tab, you can seed data programmatically:

### Option 1: Add Button to Profile Screen

1. Open `src/screens/ProfileScreen.tsx`

2. Add import:
```typescript
import { seedFirestoreData } from '../services/seedData';
```

3. Add button in the render:
```typescript
<TouchableOpacity 
  style={styles.button}
  onPress={async () => {
    await seedFirestoreData();
    alert('Data seeded!');
  }}
>
  <Text style={styles.buttonText}>Seed Data</Text>
</TouchableOpacity>
```

### Option 2: Seed on App Start (One Time)

1. Open `App.tsx`

2. Add this code:
```typescript
import { seedFirestoreData } from './src/services/seedData';

useEffect(() => {
  // Uncomment to seed on app start (only once!)
  // seedFirestoreData();
}, []);
```

3. Uncomment the line, run app once, then comment it again

---

## ✅ Verification Checklist

After adding Admin tab:

- [ ] App restarted
- [ ] Cache cleared (if needed)
- [ ] 4 tabs visible at bottom
- [ ] Admin tab (⚙️) on far right
- [ ] Admin screen opens when clicked
- [ ] "Seed Sample Data" button visible
- [ ] Button works and shows success message

If all checked, you're good to go! 🎉

---

## 📝 Summary

**Admin Tab Location:** Bottom navigation bar, far right (⚙️)

**Purpose:** Seed sample data for testing

**Usage:** Click once to populate Firestore

**After Seeding:** Can be removed or kept for future use

**Alternative:** Can seed data programmatically if tab doesn't appear

---

Need help? Check the browser console (F12) for error messages!
