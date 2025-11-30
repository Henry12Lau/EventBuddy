import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { EventProvider } from './src/context/EventContext';
import { UserProvider } from './src/context/UserContext';
import { requestNotificationPermissions } from './src/services/notificationService';

export default function App() {
  // Set status bar style for Android
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
    StatusBar.setBarStyle('dark-content');
  }

  // Request notification permissions on app start
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <UserProvider>
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </UserProvider>
  );
}
