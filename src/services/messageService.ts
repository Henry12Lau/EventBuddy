import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Message } from '../types';

const MESSAGES_COLLECTION = 'messages';

/**
 * Send a message to an event chat
 */
export const sendMessage = async (
  eventId: string,
  userId: string,
  userName: string,
  text: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      eventId,
      userId,
      userName,
      text,
      timestamp: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get all messages for an event (one-time fetch)
 */
export const getMessages = async (eventId: string): Promise<Message[]> => {
  try {
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
    })) as Message[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

/**
 * Subscribe to real-time messages for an event
 * Returns an unsubscribe function
 */
export const subscribeToMessages = (
  eventId: string,
  onMessagesUpdate: (messages: Message[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('timestamp', 'asc')
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      messagesQuery, 
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
        })) as Message[];
        
        onMessagesUpdate(messages);
      },
      (error) => {
        console.error('Error in message subscription:', error);
        if (onError) {
          onError(error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    if (onError) {
      onError(error);
    }
    return () => {}; // Return empty unsubscribe function
  }
};
