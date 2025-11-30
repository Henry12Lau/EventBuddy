import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Event } from '../types';

/**
 * Get a single user by their ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

/**
 * Get multiple users by their IDs
 */
export const getUsersByIds = async (userIds: string[]): Promise<User[]> => {
  try {
    const users = await Promise.all(
      userIds.map(id => getUserById(id))
    );
    
    // Filter out null values (users that don't exist)
    return users.filter(user => user !== null) as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Get the owner/creator of an event
 */
export const getEventOwner = async (creatorId: string): Promise<User | null> => {
  return getUserById(creatorId);
};

/**
 * Get all participants of an event
 */
export const getEventParticipants = async (participantIds: string[]): Promise<User[]> => {
  return getUsersByIds(participantIds);
};

/**
 * Get event with full user details (owner and participants)
 */
export const getEventWithUserDetails = async (event: Event) => {
  try {
    // Get owner details
    const owner = await getEventOwner(event.creatorId);
    
    // Get participant details
    const participants = await getEventParticipants(event.participants);
    
    return {
      ...event,
      ownerDetails: owner,
      participantDetails: participants
    };
  } catch (error) {
    console.error('Error fetching event with user details:', error);
    return {
      ...event,
      ownerDetails: null,
      participantDetails: []
    };
  }
};

/**
 * Find all events created by a specific user
 */
export const getEventsByCreator = async (userId: string): Promise<Event[]> => {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      where('creatorId', '==', userId)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events by creator:', error);
    return [];
  }
};

/**
 * Find all events a user has joined
 */
export const getEventsByParticipant = async (userId: string): Promise<Event[]> => {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      where('participants', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events by participant:', error);
    return [];
  }
};
