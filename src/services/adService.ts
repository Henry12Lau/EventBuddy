import { Platform } from 'react-native';

let isInitialized = false;

/**
 * Initialize Google Mobile Ads SDK
 * Call this once when app starts
 */
export const initializeAds = async () => {
  // Skip ads on web
  if (Platform.OS === 'web') {
    console.log('⚠️ Ads are not supported on web');
    return;
  }

  if (isInitialized) {
    console.log('Google Mobile Ads already initialized');
    return;
  }

  try {
    // Dynamically import only on native platforms
    const { default: mobileAds } = await import('react-native-google-mobile-ads');
    await mobileAds().initialize();
    isInitialized = true;
    console.log('✅ Google Mobile Ads initialized successfully');
  } catch (error) {
    console.error('❌ Google Mobile Ads initialization error:', error);
    console.log('⚠️ Ads will be disabled');
    // Don't set isInitialized to true, so ads won't show
  }
};

export const isAdMobReady = () => isInitialized;
