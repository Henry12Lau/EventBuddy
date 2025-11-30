# Push Notifications Guide

## Overview
The app now sends push notifications to all participants when an event is cancelled.

## How It Works

### 1. Notification Service (`src/services/notificationService.ts`)
- Handles notification permissions
- Sends local push notifications
- Notifies all event participants except the creator

### 2. Event Cancellation Flow
When an event creator cancels an event:
1. Event is marked as cancelled in Firestore
2. System retrieves all participant IDs
3. Push notification is sent to all participants (excluding the creator)
4. Notification shows: "🚫 Event Cancelled - [Event Title] on [Date] at [Time] has been cancelled by the organizer."

### 3. Notification Features
- **Title**: "🚫 Event Cancelled"
- **Body**: Event details with date and time
- **Sound**: Enabled
- **Priority**: High (Android)
- **Immediate**: Sent instantly when event is cancelled

## Permissions
- App requests notification permissions on first launch
- Users can manage permissions in device settings
- If permission denied, notifications won't be sent (but app continues to work)

## Testing
1. Create an event as User A
2. Join the event as User B
3. Cancel the event as User A
4. User B will receive a push notification

## Configuration
Notification settings are in `app.json`:
- Icon: Uses app icon
- Color: #FFB162 (orange)
- Android mode: Default

## Future Enhancements
- Push notifications for new events
- Reminders before event starts
- Notifications when someone joins your event
- Chat message notifications
