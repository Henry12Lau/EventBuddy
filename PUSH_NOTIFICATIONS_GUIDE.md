# Push Notifications for Multiple Devices

## Overview
The app now supports **real push notifications** that work across multiple devices using Expo's Push Notification Service.

## How It Works

### 1. Push Token Registration
When a user opens the app:
1. App requests notification permissions
2. Gets an Expo Push Token (unique identifier for this device)
3. Saves the token to Firestore in the user's profile
4. Token is automatically updated if it changes

### 2. Event Cancellation Flow
When an event creator cancels an event:
1. Event is marked as cancelled in Firestore
2. System fetches push tokens for all participants
3. **Local notification** sent to the device that cancelled (immediate)
4. **Push notifications** sent to all other participants' devices via Expo API
5. All devices receive the notification within seconds

### 3. Notification Types

**Local Notification (Current Device):**
- Appears immediately
- Works offline
- Shows when you cancel your own event

**Push Notification (Other Devices):**
- Sent via Expo's servers
- Works even if app is closed
- Received by all participants on their devices

## Testing with Multiple Devices

### Setup:
1. **Device A** (Creator):
   - Install the app
   - Create a user profile
   - Create an event

2. **Device B** (Participant):
   - Install the app
   - Create a different user profile
   - Join the event from Device A

### Test:
1. On **Device A**: Cancel the event
2. On **Device B**: You should receive a push notification!
3. Both devices will show the "CANCELLED" badge in real-time

## What You'll See

### On Device A (Creator):
```
=== cancelEvent called ===
Event found: Basketball Game
Fetching push tokens for participants...
Push tokens retrieved: 2
Sending local cancellation notification...
✅ Notification sent successfully!
Sending push notifications to 1 device(s)...
✅ Push notifications sent to 1 participant(s)
```

### On Device B (Participant):
- Receives push notification: "🚫 Event Cancelled"
- Notification body: "[Event Name] on [Date] at [Time] has been cancelled by the organizer."
- Can tap notification to open the app

## Technical Details

### Push Token Storage
Tokens are stored in Firestore:
```
users/{userId}
  - name: "John Doe"
  - email: "john@example.com"
  - pushToken: "ExponentPushToken[xxxxxxxxxxxxxx]"
```

### Expo Push API
The app sends notifications via:
```
POST https://exp.host/--/api/v2/push/send
```

### Notification Payload
```json
{
  "to": "ExponentPushToken[xxx]",
  "sound": "default",
  "title": "🚫 Event Cancelled",
  "body": "Event details...",
  "data": {
    "type": "event_cancelled",
    "eventTitle": "...",
    "eventDate": "...",
    "eventTime": "..."
  },
  "priority": "high"
}
```

## Limitations

### Development vs Production
- **Development**: Push notifications work immediately
- **Production**: Requires Expo account and proper configuration

### Network Requirements
- Push notifications require internet connection
- Local notifications work offline
- Firestore real-time updates require internet

### Token Expiration
- Push tokens can expire or change
- App automatically updates tokens on each launch
- Old tokens are replaced in Firestore

## Troubleshooting

### Participant Not Receiving Notifications

**Check 1: Push Token Registered**
- Look for console log: "Push token registered successfully"
- Check Firestore: users/{userId} should have pushToken field

**Check 2: Network Connection**
- Both devices need internet
- Push notifications sent via Expo's servers

**Check 3: Notification Permissions**
- Device B must have notifications enabled
- Check: Settings > Apps > EventBuddy > Notifications

**Check 4: App State**
- Push notifications work even if app is closed
- May take a few seconds to arrive

### Console Logs to Check

**On Creator's Device:**
```
Fetching push tokens for participants...
Push tokens retrieved: X
Sending push notifications to X device(s)...
```

**On Participant's Device:**
```
Registering push token for user: xxx
Got push token, saving to Firestore...
Push token registered successfully
```

## Next Steps

### For Production Deployment
1. Set up Expo account
2. Configure push notification credentials
3. Test with production build
4. Monitor notification delivery rates

### Future Enhancements
- Notification when someone joins your event
- Reminder notifications before event starts
- Chat message notifications
- Custom notification sounds
- Notification preferences/settings
