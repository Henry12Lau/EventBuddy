import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db, currentEnvironment } from '../config/firebase';
import { seedDatabase } from '../services/seedData';

export default function DatabaseMigrationScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);

  const addStatus = (message: string) => {
    console.log(message);
    setStatus(prev => [...prev, message]);
  };

  const clearStatus = () => {
    setStatus([]);
  };

  // Check if collections exist and count documents
  const checkDatabase = async () => {
    try {
      setLoading(true);
      clearStatus();
      addStatus(`🔍 Checking ${currentEnvironment} database...`);

      const collections = ['events', 'users', 'messages'];
      
      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        addStatus(`📊 ${collectionName}: ${snapshot.size} documents`);
      }

      addStatus('✅ Database check complete!');
    } catch (error: any) {
      addStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear all data from a collection
  const clearCollection = async (collectionName: string) => {
    try {
      addStatus(`🗑️ Clearing ${collectionName}...`);
      const snapshot = await getDocs(collection(db, collectionName));
      
      let deleted = 0;
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, docSnapshot.id));
        deleted++;
      }
      
      addStatus(`✅ Deleted ${deleted} documents from ${collectionName}`);
    } catch (error: any) {
      addStatus(`❌ Error clearing ${collectionName}: ${error.message}`);
      throw error;
    }
  };

  // Clear specific collection
  const clearSpecificCollection = async (collectionName: string, displayName: string) => {
    const confirmMessage = `⚠️ This will DELETE ALL ${displayName.toUpperCase()} from ${currentEnvironment} database!\n\nAre you sure?`;
    
    const confirmed = Platform.OS === 'web' 
      ? window.confirm(confirmMessage)
      : await new Promise(resolve => {
          Alert.alert(
            `Clear ${displayName}`,
            confirmMessage,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
            ]
          );
        });

    if (!confirmed) {
      addStatus('❌ Operation cancelled');
      return;
    }

    try {
      setLoading(true);
      clearStatus();
      addStatus(`🗑️ Clearing ${displayName}...`);

      await clearCollection(collectionName);

      addStatus(`✅ ${displayName} cleared!`);
      
      const message = `All ${displayName} have been deleted successfully!`;
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error: any) {
      const message = `Failed to clear ${displayName}: ${error.message}`;
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Seed database with mock data
  const seedDatabaseHandler = async () => {
    const confirmMessage = `This will add mock data to ${currentEnvironment} database.\n\nContinue?`;
    
    const confirmed = Platform.OS === 'web' 
      ? window.confirm(confirmMessage)
      : await new Promise(resolve => {
          Alert.alert(
            'Seed Database',
            confirmMessage,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Seed', onPress: () => resolve(true) }
            ]
          );
        });

    if (!confirmed) {
      addStatus('❌ Operation cancelled');
      return;
    }

    try {
      setLoading(true);
      clearStatus();
      addStatus(`🌱 Seeding ${currentEnvironment} database...`);

      await seedDatabase();

      addStatus('✅ Database seeded successfully!');
      
      const message = 'Mock data has been added successfully!';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error: any) {
      addStatus(`❌ Error: ${error.message}`);
      const message = `Failed to seed database: ${error.message}`;
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize empty collections (create them if they don't exist)
  const initializeCollections = async () => {
    try {
      setLoading(true);
      clearStatus();
      addStatus(`🔧 Initializing ${currentEnvironment} database...`);

      const collections = ['events', 'users', 'messages'];
      
      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        
        if (snapshot.size === 0) {
          // Collection is empty, create a placeholder document to initialize it
          addStatus(`📝 Creating ${collectionName} collection...`);
          const placeholderRef = await addDoc(collection(db, collectionName), {
            _placeholder: true,
            createdAt: new Date().toISOString(),
            note: 'This is a placeholder document to initialize the collection. It can be safely deleted.'
          });
          // Delete the placeholder immediately
          await deleteDoc(doc(db, collectionName, placeholderRef.id));
          addStatus(`✅ ${collectionName} collection created`);
        } else {
          addStatus(`✅ ${collectionName} collection ready (${snapshot.size} docs)`);
        }
      }

      addStatus('✅ All collections initialized!');
      
      const message = 'Database collections are ready to use!';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error: any) {
      addStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Migration</Text>
        <View style={styles.envBadge}>
          <Text style={styles.envText}>{currentEnvironment}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Database Operations</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonPrimary]} 
          onPress={checkDatabase}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Checking...' : '🔍 Check Database'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSuccess]} 
          onPress={initializeCollections}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Initializing...' : '🔧 Initialize Collections'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonWarning]} 
          onPress={seedDatabaseHandler}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Seeding...' : '🌱 Seed Mock Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonDanger]} 
          onPress={() => clearSpecificCollection('events', 'Events')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Clearing...' : '🗑️ Clear Events'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonDanger]} 
          onPress={() => clearSpecificCollection('users', 'Users')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Clearing...' : '🗑️ Clear Users'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonDanger]} 
          onPress={() => clearSpecificCollection('messages', 'Messages')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Clearing...' : '🗑️ Clear Messages'}
          </Text>
        </TouchableOpacity>
      </View>

      {status.length > 0 && (
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Status Log</Text>
          <View style={styles.statusBox}>
            {status.map((msg, index) => (
              <Text key={index} style={styles.statusText}>{msg}</Text>
            ))}
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ Information</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Check Database:</Text> View current data counts
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Initialize Collections:</Text> Verify collections exist
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Seed Mock Data:</Text> Add sample events and users
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Clear Events/Users/Messages:</Text> Delete specific data (⚠️ Dangerous!)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F1ED',
  },
  header: {
    padding: 24,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  envBadge: {
    backgroundColor: '#FFB162',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  envText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonPrimary: {
    backgroundColor: '#2C3B4D',
  },
  buttonSuccess: {
    backgroundColor: '#00B894',
  },
  buttonWarning: {
    backgroundColor: '#FFB162',
  },
  buttonDanger: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusSection: {
    padding: 24,
    paddingTop: 0,
  },
  statusBox: {
    backgroundColor: '#2D3436',
    padding: 16,
    borderRadius: 12,
    maxHeight: 300,
  },
  statusText: {
    color: '#F2F1ED',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
  infoSection: {
    padding: 24,
    paddingTop: 0,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#2D3436',
  },
});
