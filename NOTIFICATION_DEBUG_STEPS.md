# Notification Debugging Steps

## Quick Checklist

### Step 1: Test Local Notifications First
On **both devices**, go to Profile tab and tap **"🔔 Test Notification"**

**Expected Result:** You should see a notification immediately on the same device.

✅ If this works → Local notifications are working, issue is with push notifications
❌ If this doesn't work → Notification permissions issue

---

### Step 2: Check Push Token Registration
On **both devices**, go to Profile tab and tap **"🔍 Debug Push Token"**

**Check Console Logs for:**
```
=== Debug Push Token ===
Current permission status: granted
Attempting to get push token...
Getting Expo push token...
✅ Expo Push Token obtained: ExponentPushToken[xxxxxx]
✅ Push token retrieved successfully!
```

**Common Issues:**
- ❌ `permission status: denied` → Go to device Settings > Apps > Expo Go > Notifications → Enable
- ❌ `Failed to get push token` → Restart Expo Go app
- ❌ `Error getting push token` → Check internet connection

---

### Step 3: Verify Tokens Are Saved to Firestore

**Check Console Logs When App Starts:**
```
Registering push token for user: xxx
Got push token, saving to Firestore...
Push token registered successfully
```

**Manually Check Firestore:**
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Open `users` collection
4. Check each user document
5. Verify `pushToken` field exists with value like: `ExponentPushToken[xxxxxx]`

---

### Step 4: Test Event Cancellation

**On Device A (Creator):**
1. Create an event
2. Note the event name

**On Device B (Participant):**
1. Join the event created by Device A
2. Verify you see the event in your Schedule

**On Device A (Creator):**
1. Cancel the event
2. **Check Console Logs:**

```
=== cancelEvent called ===
Event found: [Event Name]
Fetching push tokens for participants...
Push tokens retrieved: 2
Sending local cancellation notification...
✅ Notification sent successfully!
Sending push notifications to 1 device(s)...
=== Sending push notifications ===
Number of tokens: 1
Tokens: ["ExponentPushToken[xxx]"]
Sending to Expo Push API...
✅ Push notification API response: {...}
✅ Success for token 0: ok
```

**On Device B (Participant):**
- Should receive notification within 5-10 seconds
- Check notification tray

---

## Common Problems & Solutions

### Problem 1: "No push tokens available for participants"

**Cause:** Push tokens not saved to Firestore

**Solution:**
1. Close and reopen Expo Go on both devices
2. Wait 5 seconds after app loads
3. Check console for "Push token registered successfully"
4. Verify in Firestore that pushToken field exists

---

### Problem 2: Local notification works, but push doesn't

**Cause:** Network issue or Expo Push API problem

**Solution:**
1. Check internet connection on both devices
2. Verify console shows: "Sending to Expo Push API..."
3. Check API response for errors
4. Try again after 30 seconds

---

### Problem 3: "Error getting push token"

**Cause:** Expo Go app issue or permissions

**Solution:**
1. Force close Expo Go app
2. Reopen and scan QR code again
3. Allow notifications when prompted
4. Check device Settings > Expo Go > Notifications

---

### Problem 4: Push token is null or undefined

**Cause:** Running in web browser or simulator without proper setup

**Solution:**
- Use real physical devices (Android or iOS)
- Don't test in web browser
- Don't test in Android emulator without Google Play Services

---

### Problem 5: Notification received but not showing

**Cause:** Device notification settings or Do Not Disturb

**Solution:**
1. Check device is not in Do Not Disturb mode
2. Check Expo Go notification settings
3. Check notification priority settings
4. Try restarting the device

---

## Expected Console Output

### When App Starts (Both Devices):
```
Registering push token for user: 1234567890
Getting Expo push token...
✅ Expo Push Token obtained: ExponentPushToken[xxxxxxxxxxxxxx]
Got push token, saving to Firestore...
Push token registered successfully
```

### When Cancelling Event (Device A):
```
=== cancelEvent called ===
Event ID: abc123
Event found: Basketball Game
Participants: ["1234567890", "0987654321"]
Creator ID: 1234567890
Cancelling event in Firestore...
Event cancelled in Firestore
Fetching push tokens for participants...
Push tokens retrieved: 2
Sending notifications...
=== notifyEventParticipants called ===
Total participants: 2
Participant IDs: ["1234567890", "0987654321"]
Current user ID: 1234567890
Sending local cancellation notification...
=== Sending notification ===
✅ Notification sent successfully!
Sending push notifications to 1 device(s)...
=== Sending push notifications ===
Number of tokens: 1
✅ Push notification API response: {"data":[{"status":"ok","id":"..."}]}
✅ Success for token 0: ok
```

### When Receiving Notification (Device B):
- Notification appears in tray
- No specific console log (notification is received silently)

---

## Still Not Working?

### Try This:
1. **Restart Everything:**
   - Close Expo Go on both devices
   - Stop Expo dev server (Ctrl+C)
   - Start Expo dev server: `npx expo start`
   - Reopen Expo Go and scan QR code on both devices

2. **Use Tunnel Mode:**
   ```bash
   npx expo start --tunnel
   ```
   This helps if devices are on different networks

3. **Check Expo Status:**
   - Visit: https://status.expo.dev/
   - Verify Expo Push Notification Service is operational

4. **Test with Expo Push Tool:**
   - Go to: https://expo.dev/notifications
   - Enter your push token
   - Send a test notification
   - If this works, the issue is in your app code

---

## Need More Help?

Share these console logs:
1. Output from "Debug Push Token" button
2. Output when cancelling an event
3. Firestore screenshot showing user documents with pushToken field
