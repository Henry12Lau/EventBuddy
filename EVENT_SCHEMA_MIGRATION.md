# Event Schema Migration Guide

## Changes Made

### 1. Field Renames
- `sport` → `icon` (to support non-sport events in the future)
- `time` → `startTime` (more descriptive)

### 2. Updated Event Schema

```typescript
{
  id: string;                    // Auto-generated document ID
  title: string;                 // Event name (required)
  icon?: string;                 // Icon emoji (optional) - CHANGED from 'sport'
  date: string;                  // Event date in YYYY-MM-DD format (required)
  startTime: string;             // Start time in HH:MM format (required) - CHANGED from 'time'
  endTime?: string;              // End time in HH:MM format (optional)
  location: string;              // Event location (required)
  maxParticipants: number;       // Maximum number of participants (required)
  participants: string[];        // Array of user IDs who joined (required)
  creatorId: string;             // User ID of event creator (required)
  description?: string;          // Event description (optional)
  isActive?: boolean;            // Event status - false means cancelled (optional)
  createdAt: Timestamp;          // Firestore timestamp (auto-added)
}
```

## Migration Steps for Firestore

You need to update existing events in Firestore to use the new field names.

### Option 1: Manual Migration Script (Recommended)

Create a migration script to update all existing events:

```typescript
// src/services/migrateEventSchema.ts
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const migrateEventSchema = async () => {
  try {
    console.log('Starting event schema migration...');
    
    const eventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollection);
    
    let updated = 0;
    let skipped = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const updates: any = {};
      
      // Migrate 'time' to 'startTime'
      if (data.time && !data.startTime) {
        updates.startTime = data.time;
        // Optionally delete old field (uncomment if you want to remove it)
        // updates.time = firebase.firestore.FieldValue.delete();
      }
      
      // Migrate 'sport' to 'icon'
      if (data.sport && !data.icon) {
        // Map sport names to icons
        const sportToIcon: { [key: string]: string } = {
          'Basketball': '🏀',
          'Football': '⚽',
          'Soccer': '⚽',
          'Tennis': '🎾',
          'Yoga': '🧘',
          'Running': '🏃',
          'Boxing': '🥊',
        };
        updates.icon = sportToIcon[data.sport] || '🎯';
        // Optionally delete old field (uncomment if you want to remove it)
        // updates.sport = firebase.firestore.FieldValue.delete();
      }
      
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'events', docSnapshot.id), updates);
        updated++;
        console.log(`✅ Updated event: ${data.title}`);
      } else {
        skipped++;
      }
    }
    
    console.log(`Migration complete! Updated: ${updated}, Skipped: ${skipped}`);
    return { updated, skipped };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
```

### Option 2: Keep Both Fields (Backward Compatible)

If you want to keep backward compatibility, you can:
1. Keep both `time` and `startTime` in the database
2. Keep both `sport` and `icon` in the database
3. The app will use the new fields, but old data still works

The current code will work with old data because:
- When reading: `event.endTime || event.startTime` will fall back to `time` if `startTime` doesn't exist
- When writing: New events will use `startTime` and `icon`

### Option 3: Reseed Data

If you're still in development and can reset data:

```bash
# Run the seed script which now uses the new schema
npm run seed
```

## Files Updated

✅ `src/types/index.ts` - Event interface
✅ `src/screens/EventsScreen.tsx` - Display and filtering
✅ `src/screens/ScheduleScreen.tsx` - Display and filtering
✅ `src/screens/CreateEventScreen.tsx` - Event creation
✅ `src/screens/EventDetailScreen.tsx` - Event display
✅ `src/context/EventContext.tsx` - Event notifications
✅ `src/services/seedData.ts` - Mock data
✅ `src/services/notificationService.ts` - Notification parameters

## Testing Checklist

- [ ] Create new event (should use `startTime` and `icon`)
- [ ] View events list (should display correctly)
- [ ] View event details (should show time correctly)
- [ ] Filter/sort events (should work with new field)
- [ ] Cancel event (notifications should work)
- [ ] Check archived events in Schedule tab

## Notes

- Old events with `time` field will still work due to fallback logic
- New events will use `startTime` field
- Consider running migration script to clean up old data
- The `icon` field is optional and can be added gradually
