import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import EventsScreen from '../screens/EventsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventChatScreen from '../screens/EventChatScreen';
import AdminScreen from '../screens/AdminScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { hasCompletedOnboarding } from '../services/storageService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2C3B4D',
          elevation: 8,
          shadowColor: '#2C3B4D',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen 
        name="EventsList" 
        component={EventsScreen} 
        options={({ navigation }) => ({
          title: 'Event Buddy',
          headerRight: () => (
            <TouchableOpacity 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: '#FFB162', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 16,
                elevation: 4,
                shadowColor: '#FFB162',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4
              }}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Text style={{ color: '#2C3B4D', fontSize: 24, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create Event' }} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EventChat" component={EventChatScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  // Check if we're in development mode
  const isDevelopment = __DEV__;
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2C3B4D',
          elevation: 8,
          shadowColor: '#2C3B4D',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        tabBarActiveTintColor: '#2C3B4D',
        tabBarInactiveTintColor: '#636E72',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#DFE6E9',
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          paddingTop: 5,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0)
        }
      }}
    >
      <Tab.Screen 
        name="Events" 
        component={EventsStack} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size }}>🎯</Text>
        }} 
      />
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen} 
        options={{ 
          title: 'My Schedule',
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size }}>📅</Text>
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size }}>👤</Text>
        }} 
      />
      {/* Admin tab - Commented out for production */}
      {/* Only show Admin tab in development mode */}
      {/* {isDevelopment && (
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ 
            title: 'Admin Tools',
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size }}>⚙️</Text>
          }} 
        />
      )} */}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainApp" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await hasCompletedOnboarding();
      setHasOnboarded(completed);
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F1ED' }}>
        <ActivityIndicator size="large" color="#2C3B4D" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#636E72', fontWeight: '600' }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {hasOnboarded ? <MainTabs /> : <RootNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
