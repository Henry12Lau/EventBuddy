import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

const USERS_COLLECTION = 'users';

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Create or update user profile
export const saveUserProfile = async (userId: string, userData: Omit<User, 'id'>): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now()
      });
    } else {
      // Create new user
      await setDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Create a new user (for initial setup)
export const createUser = async (userId: string, name: string, email: string): Promise<void> => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      name,
      email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user's push token
export const updateUserPushToken = async (userId: string, pushToken: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      pushToken,
      updatedAt: Timestamp.now()
    });
    console.log('Push token updated for user:', userId);
  } catch (error) {
    console.error('Error updating push token:', error);
    // Don't throw - push token update is not critical
  }
};

// Get push tokens for multiple users
export const getUserPushTokens = async (userIds: string[]): Promise<{ [userId: string]: string }> => {
  try {
    const tokens: { [userId: string]: string } = {};
    
    for (const userId of userIds) {
      const user = await getUserById(userId);
      if (user?.pushToken) {
        tokens[userId] = user.pushToken;
      }
    }
    
    return tokens;
  } catch (error) {
    console.error('Error getting push tokens:', error);
    return {};
  }
};
