import { Platform } from 'react-native';

// Test IDs (use during development)
const TEST_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
    web: undefined,
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
    web: undefined,
  }),
  rewarded: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
    web: undefined,
  }),
};

// Production IDs (replace with your actual Ad Unit IDs from AdMob)
const PROD_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-8613549711315773/4976435015',
    android: 'ca-app-pub-8613549711315773/4976435015',
    web: undefined,
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-8613549711315773/4976435015',
    android: 'ca-app-pub-8613549711315773/4976435015',
    web: undefined,
  }),
  rewarded: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/5555555555',
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/6666666666',
    web: undefined,
  }),
};

// Use test IDs in development, production IDs in production
const isDevelopment = __DEV__;

export const AD_UNIT_IDS = isDevelopment ? TEST_IDS : PROD_IDS;

export const AD_CONFIG = {
  // Show ads to all users (set to false for premium users)
  // Disable ads on web
  showAds: Platform.OS !== 'web',
  
  // Banner ad settings
  bannerEnabled: Platform.OS !== 'web',
  
  // Interstitial ad settings
  interstitialEnabled: Platform.OS !== 'web',
  interstitialFrequency: 3, // Show after every 3 actions
  
  // Rewarded ad settings
  rewardedEnabled: false, // Enable when you add rewarded features
};

// Initialize Google Mobile Ads
export const initializeAds = async () => {
  // Skip on web
  if (Platform.OS === 'web') {
    console.log('⚠️ Ads are not supported on web');
    return;
  }

  try {
    const { default: mobileAds, MaxAdContentRating } = await import('react-native-google-mobile-ads');
    await mobileAds().initialize();
    
    // Configure for family-friendly content
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    
    console.log('Google Mobile Ads initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Mobile Ads:', error);
  }
};
