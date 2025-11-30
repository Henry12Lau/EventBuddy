import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions and get push token
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Get Expo push token for this device
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('❌ No notification permission, cannot get push token');
      return null;
    }

    console.log('Getting Expo push token...');
    
    // Get the token with explicit projectId
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'b58b1a24-657f-4dba-801e-f327fe8e5c92'
    });
    
    console.log('✅ Expo Push Token obtained:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error('❌ Error getting push token:', error);
    return null;
  }
};

// Send local notification for event cancellation
export const sendEventCancelledNotification = async (
  eventTitle: string,
  eventDate: string,
  eventTime: string
): Promise<void> => {
  try {
    console.log('=== Sending notification ===');
    console.log('Event:', eventTitle);
    console.log('Date:', eventDate);
    console.log('Time:', eventTime);
    
    const hasPermission = await requestNotificationPermissions();
    console.log('Has permission:', hasPermission);
    
    if (!hasPermission) {
      console.log('❌ Notification permission not granted');
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚫 Event Cancelled',
        body: `"${eventTitle}" on ${eventDate} at ${eventTime} has been cancelled by the organizer.`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'event_cancelled', eventTitle, eventDate, eventTime },
      },
      trigger: null, // Send immediately
    });
    
    console.log('✅ Notification sent successfully! ID:', notificationId);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
};

// Send push notifications to multiple devices via Expo Push API
export const sendPushNotifications = async (
  pushTokens: string[],
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    console.log('=== Sending push notifications ===');
    console.log('Number of tokens:', pushTokens.length);
    console.log('Tokens:', pushTokens);
    
    if (pushTokens.length === 0) {
      console.log('⚠️ No push tokens to send to');
      return;
    }
    
    const messages = pushTokens.map(token => ({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data || {},
      priority: 'high' as const,
    }));

    console.log('Sending to Expo Push API...');
    console.log('Messages:', JSON.stringify(messages, null, 2));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('✅ Push notification API response:', JSON.stringify(result, null, 2));
    
    // Check for errors in response
    if (result.data) {
      result.data.forEach((item: any, index: number) => {
        if (item.status === 'error') {
          console.error(`❌ Error for token ${index}:`, item.message);
        } else {
          console.log(`✅ Success for token ${index}:`, item.status);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error sending push notifications:', error);
  }
};

// Send notification to multiple users (for participants)
export const notifyEventParticipants = async (
  participantIds: string[],
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  currentUserId: string,
  participantTokens?: { [userId: string]: string }
): Promise<void> => {
  try {
    console.log('=== notifyEventParticipants called ===');
    console.log('Total participants:', participantIds.length);
    console.log('Participant IDs:', participantIds);
    console.log('Current user ID:', currentUserId);
    
    // Always send local notification on this device
    console.log('Sending local cancellation notification...');
    await sendEventCancelledNotification(eventTitle, eventDate, eventTime);
    
    // Send push notifications to other participants if tokens are provided
    if (participantTokens) {
      const participantsToNotify = participantIds.filter(id => id !== currentUserId);
      const tokens = participantsToNotify
        .map(id => participantTokens[id])
        .filter(token => token); // Remove undefined tokens
      
      if (tokens.length > 0) {
        console.log(`Sending push notifications to ${tokens.length} device(s)...`);
        await sendPushNotifications(
          tokens,
          '🚫 Event Cancelled',
          `"${eventTitle}" on ${eventDate} at ${eventTime} has been cancelled by the organizer.`,
          { type: 'event_cancelled', eventTitle, eventDate, eventTime }
        );
        console.log(`✅ Push notifications sent to ${tokens.length} participant(s)`);
      } else {
        console.log('⚠️ No push tokens available for participants');
      }
    } else {
      console.log('⚠️ No participant tokens provided');
    }
  } catch (error) {
    console.error('❌ Error notifying participants:', error);
    throw error;
  }
};

// Test notification function
export const sendTestNotification = async (): Promise<void> => {
  try {
    console.log('=== Sending test notification ===');
    
    const hasPermission = await requestNotificationPermissions();
    console.log('Has permission:', hasPermission);
    
    if (!hasPermission) {
      console.log('❌ Notification permission not granted');
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Test Notification',
        body: 'If you see this, notifications are working!',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
    
    console.log('✅ Test notification sent! ID:', notificationId);
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
  }
};

// Debug function to check push token
export const debugPushToken = async (): Promise<void> => {
  try {
    console.log('=== Debug Push Token ===');
    
    // Check permissions
    const { status } = await Notifications.getPermissionsAsync();
    console.log('Current permission status:', status);
    
    if (status !== 'granted') {
      console.log('Requesting permissions...');
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      console.log('New permission status:', newStatus);
    }
    
    // Try to get push token
    console.log('Attempting to get push token...');
    const token = await getExpoPushToken();
    
    if (token) {
      console.log('✅ Push token retrieved successfully!');
      console.log('Token:', token);
    } else {
      console.log('❌ Failed to get push token');
    }
  } catch (error) {
    console.error('❌ Error in debug:', error);
  }
};
