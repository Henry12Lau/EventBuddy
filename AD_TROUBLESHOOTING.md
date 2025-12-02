# Ad Troubleshooting Guide

## ✅ Fixed: "Runtime Not Ready" Error

I've added proper AdMob initialization to fix this error.

### What I Changed:

1. **Created `src/services/adService.ts`**
   - Initializes AdMob SDK
   - Sets test device for development

2. **Updated `App.tsx`**
   - Calls `initializeAds()` on app start
   - Waits for initialization before showing ads

3. **Updated `BannerAd` component**
   - Waits 1 second for AdMob to initialize
   - Checks if AdMob is ready before showing

4. **Updated `useInterstitialAd` hook**
   - Waits 2 seconds for AdMob to initialize
   - Checks if AdMob is ready before loading ads

---

## 🔄 Next Steps:

### 1. Restart Your App

```bash
# Stop the current server (Ctrl+C)
# Clear cache and restart
npm start -- --clear
```

### 2. Rebuild Your App

If you're testing on a physical device:

```bash
# For Android
eas build --profile development --platform android

# For iOS
eas build --profile development --platform ios
```

### 3. Check Console Logs

You should see:
```
✅ AdMob initialized successfully
Banner ad loaded successfully
Interstitial ad loaded
```

---

## 🐛 Common Issues & Solutions:

### Issue 1: Still Getting "Runtime Not Ready"

**Solution:**
- Make sure you restarted the app completely
- Clear app data on your device
- Rebuild the app with `eas build`

### Issue 2: Ads Not Showing

**Solution:**
- Check console logs for errors
- Verify Ad Unit IDs are correct in `adConfig.ts`
- Wait 24 hours after creating AdMob account
- Make sure you have internet connection

### Issue 3: "Invalid Ad Unit ID"

**Solution:**
- Check `app.json` has correct App IDs
- Check `adConfig.ts` has correct Ad Unit IDs
- Make sure IDs start with `ca-app-pub-`
- Rebuild app after changing IDs

### Issue 4: Ads Show in Development but Not Production

**Solution:**
- Update `PROD_IDS` in `adConfig.ts` with your real Ad Unit IDs
- Make sure you're not using test IDs in production
- Wait for AdMob account approval (can take 24-48 hours)

---

## 📱 Testing Checklist:

- [ ] App starts without crashes
- [ ] Console shows "AdMob initialized successfully"
- [ ] Banner ad appears at bottom of Events screen
- [ ] Banner ad shows Google test ad
- [ ] Interstitial ad loads (check console)
- [ ] Interstitial ad shows after joining 3 events
- [ ] No "runtime not ready" errors

---

## 🔍 Debug Mode:

To see detailed ad logs, check your console for:

```
✅ AdMob initialized successfully
AdMob test device set
Banner ad loaded successfully
Interstitial ad loaded
Action count: 1/3
Action count: 2/3
Action count: 3/3
Showing interstitial ad
```

---

## ⚠️ Important Notes:

### Development vs Production:

**Development (__DEV__ = true):**
- Uses test Ad Unit IDs automatically
- Safe to click ads
- No revenue
- Ads load quickly

**Production (__DEV__ = false):**
- Uses your real Ad Unit IDs
- DON'T click your own ads!
- Real revenue
- May take time to load

### First Time Setup:

- AdMob account needs approval (24-48 hours)
- Test ads work immediately
- Production ads may not show until approved
- Fill rate improves over time

---

## 🚀 If Everything Works:

You should see:
1. ✅ App starts normally
2. ✅ Banner ad at bottom of Events screen
3. ✅ Test ad shows (Google's test ad)
4. ✅ Interstitial ad after 3 joins
5. ✅ No errors in console

**Next:** Update your Ad Unit IDs in `adConfig.ts` for production!

---

## 📞 Still Having Issues?

Check these files:
1. `App.tsx` - AdMob initialization
2. `src/services/adService.ts` - Initialization logic
3. `src/config/adConfig.ts` - Ad Unit IDs
4. `app.json` - AdMob App IDs

Make sure all IDs are correct and app is rebuilt after changes.
