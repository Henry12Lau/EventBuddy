import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Determine environment
const isDevelopment = __DEV__ || process.env.EXPO_PUBLIC_ENV === 'development';
const environment = isDevelopment ? 'DEV' : 'PROD';

console.log(`🔥 Firebase Environment: ${environment}`);

// Firebase configuration from environment variables
// These are safe to expose in client-side code (they're public identifiers)
// Security is handled by Firebase Security Rules, not by hiding these values
const firebaseConfig = isDevelopment ? {
  // Development Firebase Project
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_DEV_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_DEV_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_DEV_APP_ID
} : {
  // Production Firebase Project
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_PROD_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROD_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_PROD_APP_ID
};

// Validate that all required config values are present
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error(`❌ Missing Firebase ${environment} configuration keys:`, missingKeys);
  console.error('Please create a .env file with your Firebase credentials. See .env.example for reference.');
  console.error('Current config:', firebaseConfig);
  throw new Error(`Missing Firebase ${environment} configuration: ${missingKeys.join(', ')}`);
}

console.log(`✅ Firebase ${environment} config loaded:`, firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

// Initialize Firestore Database
export const db = getFirestore(app);
console.log('✅ Firestore initialized');

// Initialize Firebase Authentication
export const auth = getAuth(app);
console.log('✅ Firebase Auth initialized');

// Export environment info
export const isDevEnvironment = isDevelopment;
export const currentEnvironment = environment;

export default app;
