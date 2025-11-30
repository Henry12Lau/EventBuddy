import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Migration script to add isActive field to all existing events
 * Run this once to update your existing events in Firestore
 */
export const migrateEventsToIsActive = async () => {
  try {
    console.log('Starting migration: Adding isActive field to all events...');
    
    const eventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollection);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const eventDoc of querySnapshot.docs) {
      const eventData = eventDoc.data();
      
      // Check if isActive field already exists
      if (eventData.isActive !== undefined) {
        console.log(`Skipped: ${eventDoc.id} - already has isActive field`);
        skippedCount++;
        continue;
      }
      
      // Add isActive: true to all existing events
      await updateDoc(doc(db, 'events', eventDoc.id), {
        isActive: true
      });
      
      console.log(`Updated: ${eventDoc.id} - added isActive: true`);
      updatedCount++;
    }
    
    console.log('\n✅ Migration completed!');
    console.log(`Updated: ${updatedCount} events`);
    console.log(`Skipped: ${skippedCount} events (already migrated)`);
    
    return {
      success: true,
      updated: updatedCount,
      skipped: skippedCount,
      total: querySnapshot.docs.length
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Migration script to convert old 'status' field to 'isActive'
 * Use this if you have events with status: 'cancelled'
 */
export const migrateStatusToIsActive = async () => {
  try {
    console.log('Starting migration: Converting status to isActive...');
    
    const eventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollection);
    
    let updatedCount = 0;
    
    for (const eventDoc of querySnapshot.docs) {
      const eventData = eventDoc.data();
      
      // Check if event has old 'status' field
      if (eventData.status === 'cancelled') {
        await updateDoc(doc(db, 'events', eventDoc.id), {
          isActive: false,
          status: null  // Remove old field
        });
        
        console.log(`Converted: ${eventDoc.id} - status: 'cancelled' → isActive: false`);
        updatedCount++;
      }
    }
    
    console.log('\n✅ Migration completed!');
    console.log(`Converted: ${updatedCount} events`);
    
    return {
      success: true,
      converted: updatedCount
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};
