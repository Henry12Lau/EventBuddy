import { useUser } from '../context/UserContext';

/**
 * Hook to check if current user is an admin
 * 
 * Checks the 'role' field in user document:
 * - role = 0 → Admin user
 * - role = 1 → Normal user (default)
 * - role = undefined → Normal user (default)
 * 
 * To make a user admin:
 * 1. Go to Firebase Console → Firestore
 * 2. Find users collection → Your user document
 * 3. Add/Edit field: role = 0 (number)
 * 4. Save and restart app
 */
export const useIsAdmin = (): boolean => {
  const { currentUser } = useUser();
  
  if (!currentUser) return false;
  
  // Check if user has admin role (0 = admin)
  return currentUser.role === 0;
};
