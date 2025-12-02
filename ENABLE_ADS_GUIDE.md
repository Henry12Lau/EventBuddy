# How to Enable Ads in Your App

## ⚠️ Important: Ads Require Custom Development Build

The error you're seeing is because `expo-ads-admob` **does not work with Expo Go**. You need to create a **custom development build** using EAS (Expo Application Services).

---

## Why Ads Are Currently Disabled

I've disabled ads in `src/config/adConfig.ts` so your app works normally. Once you build with EAS, you can enable them.

---

## Steps to Enable Ads

### Step 1: Build Custom Development Build

```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --profile development --platform android

# Build for iOS (requires Apple Developer account)
eas build --profile development --platform ios
```

### Step 2: Install the Build on Your Device

After the build completes:
1. Download the APK (Android) or IPA (iOS)
2. Install on your device
3. Run the app

### Step 3: Enable Ads

Open `src/config/adConfig.ts` and change:

```typescript
export const AD_CONFIG = {
  showAds: true,        // Change to true
  bannerEnabled: true,  // Change to true
  interstitialEnabled: true,  // Change to true
  interstitialFrequency: 3,
  rewardedEnabled: false,
};
```

### Step 4: Update Ad Unit IDs

1. **Update `app.json`** with your AdMob App IDs (lines 13 & 20)
2. **Update `src/config/adConfig.ts`** with your Ad Unit IDs (lines 22-32)

### Step 5: Rebuild and Test

```bash
# Rebuild with ads enabled
eas build --profile development --platform android
```

---

## Alternative: Use Different Ad Solution

If you want ads to work with Expo Go, consider these alternatives:

### Option 1: React Native Google Mobile Ads

```bash
npm install @react-native-google-mobile-ads/admob
```

**Pros:**
- Better maintained
- More features
- Better performance

**Cons:**
- Still requires custom build
- More complex setup

### Option 2: Wait Until Production

You can add ads later when you're ready to publish:

1. Develop your app without ads
2. When ready to publish, build production version
3. Enable ads in production build
4. Publish to app stores

---

## Current Status

✅ **App works normally** (ads disabled)
✅ **Ad code is ready** (just disabled)
✅ **AdMob account set up**
✅ **Ad Unit IDs ready**

❌ **Ads won't show** until you build with EAS
❌ **Expo Go doesn't support** expo-ads-admob

---

## Quick Decision Guide

### If you want ads NOW:
1. Run `eas build --profile development --platform android`
2. Install the build on your device
3. Enable ads in `adConfig.ts`
4. Test

### If you want to wait:
1. Continue developing without ads
2. Add ads before publishing to app stores
3. Build production version with ads enabled

### If you want to remove ads completely:
1. Uninstall the package: `npm uninstall expo-ads-admob`
2. Remove ad components and hooks
3. Remove AdMob config from `app.json`

---

## Testing Without Building

You can't test `expo-ads-admob` with Expo Go, but you can:

1. **Test app functionality** - Everything else works
2. **Test UI layout** - See where ads would appear
3. **Test logic** - Ad calls are safe (just don't show)

---

## When You're Ready

1. ✅ Make sure AdMob account is approved (24-48 hours)
2. ✅ Update Ad Unit IDs in code
3. ✅ Build with EAS
4. ✅ Enable ads in `adConfig.ts`
5. ✅ Test on real device
6. ✅ Publish to app stores

---

## Summary

**Current State:**
- App works perfectly without ads
- Ad code is ready and waiting
- Just needs EAS build to enable

**To Enable Ads:**
1. Build with EAS
2. Change `showAds: true` in `adConfig.ts`
3. Update Ad Unit IDs
4. Test and publish

Your app is ready for ads whenever you are! 🚀
