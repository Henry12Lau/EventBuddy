# Notification Troubleshooting Guide

## Testing Notifications

### Step 1: Test Basic Notifications
1. Open the app
2. Go to the **Profile** tab
3. Tap the **"🔔 Test Notification"** button
4. You should see a notification appear

If you see the test notification, notifications are working!

### Step 2: Test Event Cancellation Notifications
1. **Create an event** (as User A)
2. **Join the event** with another user (User B) - or just join with the creator
3. **Cancel the event** (as User A - the creator)
4. You should see a notification: "🚫 Event Cancelled"

## Common Issues

### Issue 1: No Notification Appears
**Possible causes:**
- Notification permissions not granted
- App needs to be rebuilt after adding expo-notifications
- Notifications disabled in device settings

**Solutions:**
1. Check device notification settings for EventBuddy
2. Rebuild the app: `npm run android` or rebuild APK
3. Check the console logs for permission status

### Issue 2: Permission Denied
**Solution:**
1. Go to device Settings > Apps > EventBuddy > Notifications
2. Enable notifications
3. Restart the app

### Issue 3: Notifications Only Show When App is Open
**This is expected behavior for local notifications!**
- Local notifications show immediately when triggered
- They appear in the notification tray
- If the app is in foreground, you'll see them as banners

### Issue 4: Multiple Devices Not Receiving Notifications
**This is a limitation of the current implementation:**
- Current implementation uses **local notifications**
- Local notifications only show on the device that triggers them
- To send notifications to other devices, you need:
  - Expo Push Notification Service
  - Push tokens for each device
  - A backend server to send push notifications

## How to Check Logs

Look for these console messages:
```
=== Sending notification ===
Has permission: true
✅ Notification sent successfully! ID: xxx
```

If you see:
```
❌ Notification permission not granted
```
Then you need to grant permissions in device settings.

## Next Steps for Real Multi-Device Notifications

To send notifications to participants on different devices:

1. **Set up Expo Push Notifications:**
   - Get push tokens for each user's device
   - Store tokens in Firestore
   - Use Expo's push notification service

2. **Backend Integration:**
   - Create a cloud function (Firebase Functions)
   - When event is cancelled, send push to all participant tokens
   - Handle token management and cleanup

3. **Update the code:**
   - Store push tokens when users log in
   - Retrieve participant tokens when cancelling
   - Send push notifications via Expo API

## Current Behavior

Right now, when you cancel an event:
1. ✅ Event is marked as cancelled in Firestore
2. ✅ All devices see the "CANCELLED" badge (real-time)
3. ✅ A local notification is sent on the device that cancelled
4. ❌ Other devices don't receive push notifications (requires backend)

The visual indicators (cancelled badge, red overlay) work across all devices in real-time!
