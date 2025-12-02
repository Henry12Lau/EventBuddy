import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AD_CONFIG } from '../config/adConfig';

interface BannerAdProps {
  position?: 'top' | 'bottom';
}

export default function BannerAd({ position = 'bottom' }: BannerAdProps) {
  // Don't show if ads are disabled or on web
  if (!AD_CONFIG.bannerEnabled || !AD_CONFIG.showAds || Platform.OS === 'web') {
    return null;
  }

  // Dynamically import and render only on native
  const [BannerAdComponent, setBannerAdComponent] = React.useState<any>(null);

  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-google-mobile-ads').then(({ BannerAd: GoogleBannerAd, BannerAdSize }) => {
        const { AD_UNIT_IDS } = require('../config/adConfig');
        
        if (!AD_UNIT_IDS.banner) {
          return;
        }

        setBannerAdComponent(() => (
          <View style={[styles.container, position === 'top' ? styles.top : styles.bottom]}>
            <GoogleBannerAd
              unitId={AD_UNIT_IDS.banner}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: false,
              }}
              onAdFailedToLoad={(error) => {
                console.log('Banner ad failed to load:', error);
              }}
              onAdLoaded={() => {
                console.log('Banner ad loaded successfully');
              }}
            />
          </View>
        ));
      }).catch(error => {
        console.log('Failed to load banner ad:', error);
      });
    }
  }, [position]);

  return BannerAdComponent || null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9EDEF',
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
