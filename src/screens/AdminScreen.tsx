import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { seedFirestoreData } from '../services/seedData';
import { migrateEventsToIsActive } from '../services/migrateEvents';

export default function AdminScreen() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigrateData = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateEventsToIsActive();
      const message = `Migration completed!\n\nUpdated: ${result.updated} events\nSkipped: ${result.skipped} events\nTotal: ${result.total} events`;
      
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error: any) {
      const errorMessage = 'Migration failed. Check console for details.';
      
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error(error);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await seedFirestoreData();
      const message = `Successfully seeded:\n- 1 sample user (Demo User)\n- ${result.count - 1} events to Firestore!`;
      
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error: any) {
      const errorMessage = 'Failed to seed data. Make sure Firestore is enabled in Firebase Console.';
      
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Tools</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔄 Migrate Database</Text>
        <Text style={styles.cardDescription}>
          Add isActive field to existing events:{'\n'}
          • Updates all events in Firestore{'\n'}
          • Sets isActive: true for all events{'\n'}
          • Safe to run multiple times{'\n\n'}
          Run this ONCE after updating your app!
        </Text>
        
        <TouchableOpacity 
          style={[styles.migrateButton, isMigrating && styles.buttonDisabled]}
          onPress={handleMigrateData}
          disabled={isMigrating}
        >
          <Text style={styles.buttonText}>
            {isMigrating ? 'Migrating...' : 'Migrate Events to isActive'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌱 Seed Database</Text>
        <Text style={styles.cardDescription}>
          Populate Firestore with sample data:{'\n'}
          • 1 demo user profile{'\n'}
          • 9 sample events{'\n\n'}
          Only do this once!
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, isSeeding && styles.buttonDisabled]}
          onPress={handleSeedData}
          disabled={isSeeding}
        >
          <Text style={styles.buttonText}>
            {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Migration Instructions</Text>
        <Text style={styles.infoText}>
          1. Click "Migrate Events to isActive" button{'\n'}
          2. Wait for success message{'\n'}
          3. Check how many events were updated{'\n'}
          4. Safe to run multiple times{'\n'}
          5. Only updates events that need it
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Seed Instructions</Text>
        <Text style={styles.infoText}>
          1. Make sure Firestore is enabled{'\n'}
          2. Set security rules to test mode{'\n'}
          3. Click "Seed Sample Data" once{'\n'}
          4. Check Firebase Console to verify{'\n'}
          5. Go to Events/Profile tabs
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>👤 Sample User</Text>
        <Text style={styles.infoText}>
          Name: Demo User{'\n'}
          Email: demo@eventbuddy.com{'\n\n'}
          You can edit this in the Profile tab!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F1ED',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#636E72',
    marginBottom: 20,
    lineHeight: 22,
  },
  migrateButton: {
    backgroundColor: '#2C3B4D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  button: {
    backgroundColor: '#FFB162',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#C9C1B1',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#E8F4F8',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2C3B4D',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 24,
  },
});
