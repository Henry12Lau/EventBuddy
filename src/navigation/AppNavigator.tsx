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
import DatabaseMigrationScreen from '../screens/DatabaseMigrationScreen';
import { hasCompletedOnboarding } from '../services/storageService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { flex: 1 },
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
      <Stack.Screen 
        name="CreateEvent" 
        component={CreateEventScreen} 
        options={{ title: 'Create Event' }} 
      />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EventChat" 
        component={EventChatScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { flex: 1 },
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
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="DatabaseMigration" 
        component={DatabaseMigrationScreen} 
        options={{ title: 'Database Migration' }}
      />
      <Stack.Screen 
        name="AdminPanel" 
        component={AdminScreen} 
        options={{ title: 'Admin Panel' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  // Check if we're in development mode
  const isDevelopment = __DEV__;
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2C3B4D',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 22,
          letterSpacing: 0.3,
        },
        tabBarActiveTintColor: '#FFB162',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 65 + (insets.bottom > 0 ? insets.bottom : 0),
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconText = '';
          let iconSize = focused ? 26 : 24;
          
          if (route.name === 'Events') {
            iconText = '🎯';
          } else if (route.name === 'Schedule') {
            iconText = '📅';
          } else if (route.name === 'Profile') {
            iconText = '👤';
          }
          
          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? 'rgba(255, 177, 98, 0.15)' : 'transparent',
              marginTop: 4,
            }}>
              <Text style={{ 
                fontSize: iconSize,
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}>
                {iconText}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Events" 
        component={EventsStack} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Events',
        }} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('Events', { screen: 'EventsList' });
          },
        })}
      />
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen} 
        options={{ 
          title: 'My Schedule',
          tabBarLabel: 'Schedule',
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Profile',
        }} 
      />
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
