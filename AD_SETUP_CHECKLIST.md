# Ad Setup Checklist

## ✅ Completed Steps:

- [x] Step 1: Created AdMob account
- [x] Step 2: Created ad units (banner, interstitial)
- [x] Step 3: Installed `expo-ads-admob`
- [x] Step 4: Configured `app.json`
- [x] Step 5: Created `adConfig.ts`
- [x] Step 6: Created ad components and integrated

---

## 📝 Next Steps:

### 1. Update app.json with Your AdMob App IDs

Open `app.json` and replace these placeholders:

```json
"ios": {
  "config": {
    "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
  }
},
"android": {
  "config": {
    "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ"
  }
}
```

Replace with your actual App IDs from AdMob Console.

---

### 2. Update adConfig.ts with Your Ad Unit IDs

Open `src/config/adConfig.ts` and replace the `PROD_IDS`:

```typescript
const PROD_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/1111111111', // Your iOS banner ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/2222222222', // Your Android banner ID
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/3333333333', // Your iOS interstitial ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/4444444444', // Your Android interstitial ID
  }),
};
```

Replace with your actual Ad Unit IDs from AdMob Console.

---

### 3. Test with Development Build

```bash
# Restart your development server
npm start -- --clear
```

**What to expect:**
- ✅ Banner ad appears at bottom of Events screen
- ✅ Test ads show (Google test ads)
- ✅ Interstitial ad shows after joining event 3 times
- ✅ Console logs show ad loading status

---

### 4. Build for Testing

```bash
# Build development version
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

Install on your device and test:
- ✅ Ads load properly
- ✅ No crashes
- ✅ Ads don't block important content

---

### 5. Before Production

1. **Update Ad Unit IDs** in `adConfig.ts` with production IDs
2. **Update App IDs** in `app.json` with production IDs
3. **Test thoroughly** on real devices
4. **Build production version:**

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

---

## 🎯 Current Ad Placements:

### Banner Ads:
- ✅ **Events Screen** - Bottom of screen
- 📍 **Suggested**: Add to Schedule screen, Profile screen

### Interstitial Ads:
- ✅ **After joining event** - Shows every 3 joins
- 📍 **Suggested**: After creating event, after leaving event

---

## 🔧 Configuration Options:

### In `src/config/adConfig.ts`:

```typescript
export const AD_CONFIG = {
  showAds: true,              // Set to false to disable all ads
  bannerEnabled: true,         // Enable/disable banner ads
  interstitialEnabled: true,   // Enable/disable interstitial ads
  interstitialFrequency: 3,    // Show ad every X actions (adjust as needed)
  rewardedEnabled: false,      // Enable when you add rewarded features
};
```

---

## 📊 Testing Tips:

### Development Mode:
- Uses Google test ad IDs automatically
- Safe to click test ads
- No revenue generated

### Production Mode:
- Uses your real ad IDs
- **DON'T click your own ads!** (can get banned)
- Real revenue generated

---

## 🐛 Troubleshooting:

### Ads Not Showing?

1. **Check console logs** for errors
2. **Verify Ad Unit IDs** are correct
3. **Wait 24 hours** after creating AdMob account
4. **Check internet connection**
5. **Rebuild app** after config changes

### App Crashes?

1. **Check AdMob App IDs** in app.json
2. **Verify package installed:** `expo-ads-admob`
3. **Clear cache:** `npm start -- --clear`
4. **Rebuild app**

---

## 📱 Where Ads Appear:

### Events Screen:
```
┌─────────────────────────┐
│ Search Bar              │
├─────────────────────────┤
│                         │
│ Event List              │
│ (scrollable)            │
│                         │
├─────────────────────────┤
│ [Banner Ad]             │ ← Ad here
└─────────────────────────┘
```

### After Actions:
```
User joins event
    ↓
Success message
    ↓
[Interstitial Ad] ← Full screen ad (every 3rd time)
    ↓
Navigate back
```

---

## 💰 Expected Revenue:

With test ads: **$0** (no revenue)
With production ads: **$150-300/month** (1000 daily users)

---

## ✅ Final Checklist:

Before publishing:

- [ ] AdMob App IDs added to app.json
- [ ] Production Ad Unit IDs added to adConfig.ts
- [ ] Tested on real device
- [ ] Ads load without crashes
- [ ] Ads don't block important content
- [ ] Console logs show no errors
- [ ] Built production version
- [ ] Privacy policy updated (mentions ads)

---

## 🚀 You're Ready!

Your app now has:
- ✅ Banner ads on Events screen
- ✅ Interstitial ads after joining events
- ✅ Test ads for development
- ✅ Production ads ready (just update IDs)

**Next:** Update the placeholder IDs and test! 🎉
