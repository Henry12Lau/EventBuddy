import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AD_CONFIG } from '../config/adConfig';

let interstitialAd: any = null;
let actionCount = 0;

export const useInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!AD_CONFIG.interstitialEnabled || !AD_CONFIG.showAds || Platform.OS === 'web') {
      return;
    }

    // Dynamically import only on native platforms
    const loadAd = async () => {
      try {
        const { InterstitialAd, AdEventType } = await import('react-native-google-mobile-ads');
        const { AD_UNIT_IDS } = await import('../config/adConfig');

        if (!AD_UNIT_IDS.interstitial) {
          return;
        }

        // Create and load the interstitial ad
        if (!interstitialAd) {
          interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
            requestNonPersonalizedAdsOnly: false,
          });

          const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
            console.log('Interstitial ad loaded');
            setIsLoaded(true);
          });

          const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
            console.log('Interstitial ad closed');
            setIsLoaded(false);
            // Load a new ad for next time
            interstitialAd?.load();
          });

          const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
            console.log('Interstitial ad error:', error);
            setIsLoaded(false);
          });

          // Load the ad
          interstitialAd.load();

          return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeError();
          };
        }
      } catch (error) {
        console.log('Failed to load interstitial ad module:', error);
      }
    };

    loadAd();
  }, []);

  const showAd = async () => {
    if (!AD_CONFIG.interstitialEnabled || !AD_CONFIG.showAds || Platform.OS === 'web') {
      return;
    }

    actionCount++;

    // Show ad based on frequency setting
    if (actionCount % AD_CONFIG.interstitialFrequency === 0) {
      try {
        if (interstitialAd && isLoaded) {
          await interstitialAd.show();
        } else {
          console.log('Interstitial ad not ready');
        }
      } catch (error) {
        console.error('Error showing interstitial ad:', error);
      }
    }
  };

  return { showAd, isLoaded };
};
