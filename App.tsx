import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { EventProvider } from './src/context/EventContext';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  // Set status bar style for Android
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
    StatusBar.setBarStyle('dark-content');
  }

  return (
    <UserProvider>
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </UserProvider>
  );
}
