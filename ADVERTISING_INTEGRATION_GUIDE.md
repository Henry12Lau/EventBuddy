# Advertising Integration Guide

## Overview

This guide covers how to add advertisements to your EventBuddy app using Google AdMob (most popular for React Native/Expo apps).

---

## Option 1: Google AdMob (Recommended)

### Why AdMob?
- ✅ Most popular for mobile apps
- ✅ Works with Expo
- ✅ High fill rates
- ✅ Good revenue
- ✅ Easy to integrate

---

## Step 1: Create AdMob Account

### 1.1 Sign Up

1. Go to [AdMob](https://admob.google.com/)
2. Click **"Get Started"**
3. Sign in with Google account
4. Accept terms and conditions

### 1.2 Create App

1. Click **"Apps"** in left menu
2. Click **"Add App"**
3. Choose:
   - **Is your app listed on a supported app store?** → No (if not published yet)
   - **App name:** EventBuddy
   - **Platform:** iOS and Android (create separately)
4. Click **"Add"**

You'll get an **App ID** like:
- iOS: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
- Android: `ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ`

**Save these App IDs!**

---

## Step 2: Create Ad Units

### 2.1 Banner Ad (Bottom of screen)

1. In AdMob, go to your app
2. Click **"Ad units"** → **"Add ad unit"**
3. Choose **"Banner"**
4. Name: `EventBuddy_Banner`
5. Click **"Create ad unit"**

You'll get an **Ad Unit ID** like:
- `ca-app-pub-XXXXXXXXXXXXXXXX/1234567890`

### 2.2 Interstitial Ad (Full screen between actions)

1. Click **"Add ad unit"** again
2. Choose **"Interstitial"**
3. Name: `EventBuddy_Interstitial`
4. Click **"Create ad unit"**

You'll get another **Ad Unit ID**

### 2.3 Rewarded Ad (Optional - for premium features)

1. Click **"Add ad unit"** again
2. Choose **"Rewarded"**
3. Name: `EventBuddy_Rewarded`
4. Click **"Create ad unit"**

**Save all Ad Unit IDs!**

---

## Step 3: Install AdMob Package

### 3.1 Install Expo AdMob

```bash
npx expo install expo-ads-admob
```

### 3.2 Update app.json

Add AdMob configuration:

```json
{
  "expo": {
    "name": "EventBuddy",
    "slug": "eventbuddy",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.eventbuddy",
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.eventbuddy",
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ"
      }
    }
  }
}
```

Replace with your actual App IDs from Step 1.2

---

## Step 4: Create Ad Configuration

### 4.1 Create Ad Config File

```typescript
// src/config/adConfig.ts

import { Platform } from 'react-native';

// Test IDs (use during development)
const TEST_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  }),
  rewarded: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  }),
};

// Production IDs (use in production)
const PROD_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/1111111111', // Your iOS banner ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/2222222222', // Your Android banner ID
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/3333333333', // Your iOS interstitial ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/4444444444', // Your Android interstitial ID
  }),
  rewarded: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/5555555555', // Your iOS rewarded ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/6666666666', // Your Android rewarded ID
  }),
};

// Use test IDs in development, production IDs in production
const isDevelopment = __DEV__;

export const AD_UNIT_IDS = isDevelopment ? TEST_IDS : PROD_IDS;

export const AD_CONFIG = {
  // Show ads to non-premium users only
  showAds: true,
  
  // Banner ad settings
  bannerEnabled: true,
  
  // Interstitial ad settings
  interstitialEnabled: true,
  interstitialFrequency: 3, // Show after every 3 actions
  
  // Rewarded ad settings
  rewardedEnabled: true,
};
```

---

## Step 5: Create Ad Components

### 5.1 Banner Ad Component

```typescript
// src/components/BannerAd.tsx

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { AD_UNIT_IDS } from '../config/adConfig';

interface BannerAdProps {
  position?: 'top' | 'bottom';
}

export default function BannerAd({ position = 'bottom' }: BannerAdProps) {
  const [adError, setAdError] = React.useState(false);

  if (adError || !AD_UNIT_IDS.banner) {
    return null; // Don't show anything if ad fails
  }

  return (
    <View style={[styles.container, position === 'top' ? styles.top : styles.bottom]}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={AD_UNIT_IDS.banner}
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => {
          console.log('Banner ad error:', error);
          setAdError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
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
```

### 5.2 Interstitial Ad Hook

```typescript
// src/hooks/useInterstitialAd.ts

import { useEffect, useState } from 'react';
import { AdMobInterstitial } from 'expo-ads-admob';
import { AD_UNIT_IDS, AD_CONFIG } from '../config/adConfig';

let actionCount = 0;

export const useInterstitialAd = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!AD_CONFIG.interstitialEnabled || !AD_UNIT_IDS.interstitial) {
      return;
    }

    // Set up interstitial ad
    AdMobInterstitial.setAdUnitID(AD_UNIT_IDS.interstitial);
    
    // Load ad
    AdMobInterstitial.requestAdAsync()
      .then(() => setIsReady(true))
      .catch((error) => console.log('Interstitial ad error:', error));

    // Event listeners
    AdMobInterstitial.addEventListener('interstitialDidLoad', () => {
      setIsReady(true);
    });

    AdMobInterstitial.addEventListener('interstitialDidClose', () => {
      setIsReady(false);
      // Load next ad
      AdMobInterstitial.requestAdAsync();
    });

    return () => {
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  const showAd = async () => {
    if (!AD_CONFIG.interstitialEnabled) return;

    actionCount++;

    // Show ad every X actions
    if (actionCount >= AD_CONFIG.interstitialFrequency) {
      actionCount = 0;
      
      if (isReady) {
        try {
          await AdMobInterstitial.showAdAsync();
        } catch (error) {
          console.log('Error showing interstitial:', error);
        }
      }
    }
  };

  return { showAd, isReady };
};
```

---

## Step 6: Integrate Ads into Your App

### 6.1 Add Banner to Events Screen

```typescript
// src/screens/EventsScreen.tsx

import BannerAd from '../components/BannerAd';

export default function EventsScreen({ navigation }: any) {
  // ... existing code ...

  return (
    <View style={styles.container}>
      {/* Existing content */}
      <View style={styles.searchContainer}>
        {/* Search bar */}
      </View>
      
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 60 }} // Space for banner
      />
      
      {/* Add banner ad at bottom */}
      <BannerAd position="bottom" />
    </View>
  );
}
```

### 6.2 Add Interstitial After Actions

```typescript
// src/screens/EventDetailScreen.tsx

import { useInterstitialAd } from '../hooks/useInterstitialAd';

export default function EventDetailScreen({ route, navigation }: any) {
  const { showAd } = useInterstitialAd();
  
  const handleJoinEvent = async () => {
    // ... existing join logic ...
    
    // Show ad after joining
    await showAd();
  };

  const handleLeaveEvent = async () => {
    // ... existing leave logic ...
    
    // Show ad after leaving
    await showAd();
  };

  // ... rest of component ...
}
```

---

## Step 7: Ad Placement Strategy

### Where to Show Ads

#### ✅ Good Placements:

1. **Banner Ads:**
   - Bottom of Events list
   - Bottom of Schedule screen
   - Top of Profile screen

2. **Interstitial Ads:**
   - After joining an event
   - After creating an event
   - After leaving an event
   - Between screen transitions (not too frequent!)

3. **Rewarded Ads:**
   - Unlock premium features
   - Remove ads for 24 hours
   - Boost event visibility

#### ❌ Avoid:

- During chat (interrupts conversation)
- On event detail screen (blocks content)
- Too frequently (annoys users)
- During onboarding (bad first impression)

---

## Step 8: Testing Ads

### 8.1 Use Test Ads

During development, the app automatically uses test ad IDs (from `adConfig.ts`).

### 8.2 Test on Real Device

```bash
# Build development app
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

### 8.3 Verify Ads Show

- ✅ Banner appears at bottom
- ✅ Interstitial shows after actions
- ✅ No crashes
- ✅ Ads load quickly

---

## Step 9: Production Setup

### 9.1 Update Ad Unit IDs

In `src/config/adConfig.ts`, replace `PROD_IDS` with your real Ad Unit IDs from Step 2.

### 9.2 Build Production App

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

### 9.3 Test Production Ads

**Important:** Don't click your own ads! This can get your account banned.

- Use test devices
- Or use AdMob's test mode

---

## Revenue Optimization

### Tips to Maximize Revenue:

1. **Ad Placement**
   - Place ads where users naturally pause
   - Don't interrupt user flow

2. **Ad Frequency**
   - Not too many (annoys users)
   - Not too few (less revenue)
   - Sweet spot: Every 3-5 actions

3. **Ad Types**
   - Banner: Consistent, low revenue
   - Interstitial: Higher revenue, more intrusive
   - Rewarded: Highest revenue, user-friendly

4. **User Experience**
   - Premium option to remove ads
   - Don't show ads to paying users
   - Make ads skippable when possible

---

## Alternative: React Native Google Mobile Ads

If `expo-ads-admob` doesn't work well, use this:

```bash
npm install @react-native-google-mobile-ads/admob
```

Better performance but requires custom development build.

---

## Other Ad Networks

### Facebook Audience Network

```bash
npx expo install expo-ads-facebook
```

- Good fill rates
- Works well with AdMob
- Similar integration

### Unity Ads

- Good for gaming apps
- Video ads
- Rewarded ads

### AppLovin

- High eCPM
- Good for interstitials
- Requires SDK integration

---

## Monetization Strategy

### Free Tier (With Ads)

- ✅ All features available
- ✅ Banner ads on main screens
- ✅ Interstitial ads after actions
- ✅ Option to watch rewarded ad for benefits

### Premium Tier (No Ads)

- ✅ All features
- ✅ No ads
- ✅ Priority support
- ✅ Special badge
- ✅ $2.99/month or $19.99/year

---

## Legal Requirements

### Privacy Policy

Must disclose:
- You show ads
- Ads may collect data
- Link to AdMob privacy policy

### GDPR Compliance (Europe)

- Show consent dialog
- Allow users to opt out
- Use `servePersonalizedAds={false}` if user opts out

### COPPA Compliance (Children)

- If app is for children under 13
- Use `tagForChildDirectedTreatment={true}`

---

## Troubleshooting

### Ads Not Showing

**Problem:** Ads don't appear

**Solutions:**
1. Check Ad Unit IDs are correct
2. Wait 24 hours after creating AdMob account
3. Verify app is approved in AdMob
4. Check internet connection
5. Look at console logs for errors

### Low Fill Rate

**Problem:** Ads show sometimes, not always

**Solutions:**
1. Normal for new apps
2. Add more ad networks (mediation)
3. Improve app quality
4. Wait for more users

### Account Suspended

**Problem:** AdMob account banned

**Solutions:**
1. Don't click your own ads
2. Don't ask users to click ads
3. Follow AdMob policies
4. Appeal if wrongly banned

---

## Quick Start Checklist

- [ ] Create AdMob account
- [ ] Create app in AdMob
- [ ] Create ad units (banner, interstitial)
- [ ] Install `expo-ads-admob`
- [ ] Update `app.json` with App IDs
- [ ] Create `adConfig.ts`
- [ ] Create `BannerAd` component
- [ ] Create `useInterstitialAd` hook
- [ ] Add banner to Events screen
- [ ] Add interstitial after actions
- [ ] Test with test ads
- [ ] Update with production Ad Unit IDs
- [ ] Build and publish app
- [ ] Monitor revenue in AdMob

---

## Expected Revenue

### Estimates (varies widely):

- **Banner Ads:** $0.10 - $1.00 per 1000 impressions
- **Interstitial Ads:** $2.00 - $10.00 per 1000 impressions
- **Rewarded Ads:** $5.00 - $20.00 per 1000 impressions

### Example:
- 1000 daily active users
- Each sees 5 banner ads = 5000 impressions
- Each sees 2 interstitials = 2000 impressions
- Revenue: $5-10/day = $150-300/month

**Note:** Actual revenue depends on:
- User location
- App category
- Ad placement
- User engagement

---

## Summary

✅ **Create AdMob account and app**
✅ **Create ad units**
✅ **Install expo-ads-admob**
✅ **Configure app.json**
✅ **Create ad components**
✅ **Integrate into screens**
✅ **Test thoroughly**
✅ **Publish and monitor**

Your app is ready to generate revenue! 💰
