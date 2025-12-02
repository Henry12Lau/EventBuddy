import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@eventbuddy_user';
const ONBOARDING_KEY = '@eventbuddy_onboarding_complete';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: number;  // 0 = admin, 1 = normal user
}

/**
 * Save user data to local storage
 */
export const saveUserToStorage = async (user: StoredUser): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error saving user to storage:', error);
    throw error;
  }
};

/**
 * Get user data from local storage
 */
export const getUserFromStorage = async (): Promise<StoredUser | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Clear user data (for logout or reset)
 */
export const clearUserStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Error clearing user storage:', error);
    throw error;
  }
};
