# Onboarding Setup Guide

## 🎯 First-Time User Experience

Your app now has an onboarding flow that requires users to enter their name and email on first launch.

---

## 📦 Installation Required

### Step 1: Install AsyncStorage

```bash
npm install @react-native-async-storage/async-storage
```

Or with Expo:

```bash
npx expo install @react-native-async-storage/async-storage
```

### Step 2: Restart Your App

```bash
# Stop the current server (Ctrl+C)
npm start
```

---

## 🎨 User Flow

### First Time User:
```
1. Open app
2. See Welcome Screen
   - "Welcome to EventBuddy!"
   - Name input field
   - Email input field
3. Enter name and email
4. Click "Continue"
5. Data saved to:
   - Local storage (AsyncStorage)
   - Firestore database
6. Navigate to Events screen
```

### Returning User:
```
1. Open app
2. Check local storage
3. If name exists:
   - Skip Welcome screen
   - Go directly to Events screen
4. If no name:
   - Show Welcome screen
```

---

## 💾 Data Storage

### Local Storage (AsyncStorage):
```javascript
{
  "@eventbuddy_user": {
    "id": "1701234567890",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "@eventbuddy_onboarding_complete": "true"
}
```

### Firestore:
```javascript
users/{userId}
  ├── name: "John Doe"
  ├── email: "john@example.com"
  ├── createdAt: timestamp
  └── updatedAt: timestamp
```

---

## 🎯 Features

### Welcome Screen:
- ✅ Clean, friendly design
- ✅ Name input (required)
- ✅ Email input (required, validated)
- ✅ Form validation
- ✅ Error messages
- ✅ Loading states
- ✅ Info card explaining data usage

### Data Persistence:
- ✅ Saved to device (AsyncStorage)
- ✅ Saved to Firestore
- ✅ Survives app restarts
- ✅ Works offline (local storage)

### User Experience:
- ✅ Only shown once
- ✅ Fast subsequent launches
- ✅ No login required
- ✅ Simple and quick

---

## 🔧 How It Works

### On App Launch:
```typescript
1. Check AsyncStorage for user data
2. If user exists:
   - hasOnboarded = true
   - Show MainTabs (Events screen)
3. If no user:
   - hasOnboarded = false
   - Show Welcome screen
```

### On Welcome Screen Submit:
```typescript
1. Validate name and email
2. Generate unique user ID
3. Save to AsyncStorage
4. Save to Firestore
5. Mark onboarding complete
6. Navigate to MainApp
```

### User ID Generation:
```typescript
const userId = Date.now().toString();
// Example: "1701234567890"
```

---

## 📱 Screen Design

### Welcome Screen:
```
┌─────────────────────────────────┐
│                                 │
│            👋                   │
│                                 │
│   Welcome to EventBuddy!        │
│                                 │
│   Let's get started by setting  │
│   up your profile               │
│                                 │
├─────────────────────────────────┤
│                                 │
│   YOUR NAME *                   │
│   [Enter your name        ]     │
│                                 │
│   EMAIL ADDRESS *               │
│   [Enter your email       ]     │
│                                 │
│   ℹ️ Your information will be   │
│   saved locally on your device  │
│                                 │
│   [      Continue      ]        │
│                                 │
└─────────────────────────────────┘
```

---

## 🧪 Testing

### Test First Time User:
```bash
# Clear AsyncStorage (in browser console or app)
AsyncStorage.clear()

# Restart app
# ✅ Should see Welcome screen
```

### Test Returning User:
```bash
# Complete onboarding once
# Close and reopen app
# ✅ Should skip Welcome screen
# ✅ Go directly to Events
```

### Test Validation:
```
1. Leave name empty → Error: "Name is required"
2. Leave email empty → Error: "Email is required"
3. Enter invalid email → Error: "Please enter a valid email"
4. Enter valid data → Success, navigate to app
```

---

## 🔄 Reset Onboarding

### For Testing:

**In Browser Console:**
```javascript
// Clear all data
localStorage.clear();

// Or specific keys
localStorage.removeItem('@eventbuddy_user');
localStorage.removeItem('@eventbuddy_onboarding_complete');
```

**In React Native:**
```javascript
import { clearUserStorage } from '../services/storageService';

// Clear user data
await clearUserStorage();
```

**Add Reset Button (Development Only):**
```typescript
// In ProfileScreen
{__DEV__ && (
  <TouchableOpacity onPress={async () => {
    await clearUserStorage();
    // Restart app or navigate to Welcome
  }}>
    <Text>Reset Onboarding</Text>
  </TouchableOpacity>
)}
```

---

## 📊 Storage Service API

### Save User:
```typescript
import { saveUserToStorage } from '../services/storageService';

await saveUserToStorage({
  id: '123',
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Get User:
```typescript
import { getUserFromStorage } from '../services/storageService';

const user = await getUserFromStorage();
// Returns: { id, name, email } or null
```

### Check Onboarding:
```typescript
import { hasCompletedOnboarding } from '../services/storageService';

const completed = await hasCompletedOnboarding();
// Returns: true or false
```

### Clear Data:
```typescript
import { clearUserStorage } from '../services/storageService';

await clearUserStorage();
// Clears user data and onboarding status
```

---

## 🎨 Customization

### Change Welcome Message:
```typescript
// WelcomeScreen.tsx
<Text style={styles.title}>
  Welcome to EventBuddy! // Change this
</Text>
```

### Add More Fields:
```typescript
// Add phone number, location, etc.
const [phone, setPhone] = useState('');

<TextInput
  value={phone}
  onChangeText={setPhone}
  placeholder="Phone number (optional)"
/>
```

### Skip Firestore Save:
```typescript
// If you only want local storage
await saveUserToStorage({ id, name, email });
// Remove: await createUser(...)
```

---

## 🔐 Privacy & Security

### What's Stored:
- ✅ Name (locally and Firestore)
- ✅ Email (locally and Firestore)
- ✅ User ID (generated, not sensitive)

### What's NOT Stored:
- ❌ Passwords (no authentication yet)
- ❌ Payment info
- ❌ Sensitive personal data

### Data Usage:
- Used to identify user in events
- Displayed in chat messages
- Shown in event participants
- Stored locally for offline access

---

## 🚀 Future Enhancements

### Possible Additions:
1. **Profile Picture** - Upload avatar
2. **Bio/Description** - About me section
3. **Interests** - Favorite sports
4. **Location** - City/region
5. **Skip Option** - "I'll do this later"
6. **Social Login** - Sign in with Google/Facebook
7. **Email Verification** - Verify email address
8. **Terms & Privacy** - Accept terms checkbox

---

## 📝 Files Created

- ✅ `src/services/storageService.ts` - AsyncStorage operations
- ✅ `src/screens/WelcomeScreen.tsx` - Onboarding UI
- ✅ Updated `src/navigation/AppNavigator.tsx` - Routing logic
- ✅ `ONBOARDING_SETUP.md` - This guide

---

## ❓ FAQ

**Q: What if user clears app data?**
A: They'll see Welcome screen again and need to re-enter info.

**Q: Can users change their name later?**
A: Yes, in the Profile screen.

**Q: Is the email verified?**
A: Not yet, but can be added with Firebase Auth.

**Q: What if user enters fake email?**
A: Currently allowed, but validation can be added.

**Q: Can I skip onboarding?**
A: Not currently, but can add a "Skip" button.

**Q: Is data synced across devices?**
A: No, local storage is device-specific. Use Firebase Auth for multi-device.

---

## 🎯 Summary

**Onboarding flow:**
1. First launch → Welcome screen
2. Enter name and email
3. Save to local storage + Firestore
4. Navigate to main app
5. Subsequent launches → Skip to main app

**Installation:**
```bash
npm install @react-native-async-storage/async-storage
npm start
```

**Benefits:**
- ✅ Better user experience
- ✅ Personalized from start
- ✅ Data persists locally
- ✅ Simple and quick setup

Your app now has a professional onboarding experience! 🎉
