import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserFromStorage, StoredUser } from '../services/storageService';
import { getExpoPushToken } from '../services/notificationService';
import { updateUserPushToken } from '../services/userService';

interface UserContextType {
  currentUser: StoredUser | null;
  loading: boolean;
  setCurrentUser: (user: StoredUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    // Register push token when user is loaded
    if (currentUser) {
      registerPushToken();
    }
  }, [currentUser]);

  const loadUser = async () => {
    try {
      const user = await getUserFromStorage();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerPushToken = async () => {
    try {
      if (!currentUser) return;
      
      console.log('Registering push token for user:', currentUser.id);
      const token = await getExpoPushToken();
      
      if (token) {
        console.log('Got push token, saving to Firestore...');
        await updateUserPushToken(currentUser.id, token);
        console.log('Push token registered successfully');
      }
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, loading, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
