import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { User } from '../types';
import { getUserById, saveUserProfile } from '../services/userService';
import { saveUserToStorage } from '../services/storageService';
import { useUser } from '../context/UserContext';
import { sendTestNotification, debugPushToken } from '../services/notificationService';

export default function ProfileScreen() {
  const { currentUser, setCurrentUser } = useUser();
  const [user, setUser] = useState<User>({
    id: currentUser?.id || '1',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      if (currentUser) {
        setUser(currentUser);
        
        // Try to sync with Firestore in background
        const firestoreUser = await getUserById(currentUser.id);
        if (firestoreUser) {
          setUser(firestoreUser);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleSaveProfile = async () => {
    // Validation
    if (!user.name.trim()) {
      const message = 'Please enter your name';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Validation Error', message);
      }
      return;
    }

    if (!user.email.trim()) {
      const message = 'Please enter your email';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Validation Error', message);
      }
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      const message = 'Please enter a valid email address';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Validation Error', message);
      }
      return;
    }

    try {
      setSaving(true);
      const updatedUser = {
        id: user.id,
        name: user.name.trim(),
        email: user.email.trim(),
      };

      // Save to both local storage and Firestore
      await saveUserToStorage(updatedUser);
      await saveUserProfile(user.id, {
        name: user.name.trim(),
        email: user.email.trim(),
      });

      // Update context
      setCurrentUser(updatedUser);

      const message = 'Profile saved successfully!';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error) {
      const message = 'Failed to save profile. Please try again.';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C3B4D" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editSection}>
        <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser({...user, name: text})}
          placeholder="Enter your name"
          editable={!saving}
        />

        <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({...user, email: text})}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        <TouchableOpacity 
          style={[styles.button, saving && styles.buttonDisabled]} 
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.testButton} 
          onPress={async () => {
            await sendTestNotification();
            const message = 'Test notification sent! Check your notification tray.';
            if (Platform.OS === 'web') {
              alert(message);
            } else {
              Alert.alert('Test Sent', message);
            }
          }}
        >
          <Text style={styles.testButtonText}>
            🔔 Test Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.debugButton} 
          onPress={async () => {
            await debugPushToken();
            const message = 'Check console logs for push token details';
            if (Platform.OS === 'web') {
              alert(message);
            } else {
              Alert.alert('Debug', message);
            }
          }}
        >
          <Text style={styles.debugButtonText}>
            🔍 Debug Push Token
          </Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F1ED' },
  centerContent: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#636E72', fontWeight: '600' },
  editSection: {
    padding: 24,
    paddingTop: 20,
  },
  label: { fontSize: 15, fontWeight: '700', marginTop: 18, marginBottom: 10, color: '#2D3436', textTransform: 'uppercase', letterSpacing: 0.5 },
  required: { color: '#FF6B6B', fontSize: 15 },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#E9EDEF', 
    borderRadius: 16, 
    padding: 16, 
    fontSize: 16, 
    color: '#2D3436',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  button: { 
    backgroundColor: '#2C3B4D', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 24, 
    marginBottom: 24,
    alignItems: 'center', 
    elevation: 6, 
    shadowColor: '#2C3B4D', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 8 
  },
  buttonDisabled: {
    backgroundColor: '#C9C1B1',
    opacity: 0.6,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  testButton: { 
    backgroundColor: '#FFB162', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 12, 
    marginBottom: 24,
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#FFB162', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FF9F43'
  },
  testButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  debugButton: { 
    backgroundColor: '#6C5CE7', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 12, 
    marginBottom: 24,
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#6C5CE7', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#5F3DC4'
  },
  debugButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }
});
