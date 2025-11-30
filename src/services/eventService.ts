import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event } from '../types';

const EVENTS_COLLECTION = 'events';

// Convert Firestore timestamp to date string
const timestampToDateString = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString().split('T')[0];
  }
  return timestamp;
};

// Fetch all events from Firestore
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(eventsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: timestampToDateString(doc.data().date)
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Add a new event to Firestore
export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Join an event (add user to participants array)
export const joinEventInFirestore = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      participants: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error joining event:', error);
    throw error;
  }
};

// Cancel an event (mark as inactive)
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      isActive: false
    });
  } catch (error) {
    console.error('Error cancelling event:', error);
    throw error;
  }
};

// Exit an event (remove user from participants array)
export const exitEvent = async (eventId: string, userId: string): Promise<void> => {
  console.log('eventService.exitEvent called', { eventId, userId });
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    console.log('Updating Firestore document...');
    await updateDoc(eventRef, {
      participants: arrayRemove(userId)
    });
    console.log('Firestore update successful');
  } catch (error) {
    console.error('Error exiting event:', error);
    throw error;
  }
};

// Subscribe to real-time events updates
export const subscribeToEvents = (
  onEventsUpdate: (events: Event[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('date', 'asc')
    );
    
    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const events = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: timestampToDateString(doc.data().date)
        })) as Event[];
        
        onEventsUpdate(events);
      },
      (error) => {
        console.error('Error in events subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to events:', error);
    if (onError) {
      onError(error);
    }
    return () => {};
  }
};
