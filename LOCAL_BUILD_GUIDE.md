# Local APK Build Guide

## Building APK Locally with Ads

I've started the local build process for you. Here's what's happening:

---

## Build Command

```bash
eas build --profile local --platform android --local
```

This will:
1. ✅ Build APK on your local machine
2. ✅ Include expo-ads-admob
3. ✅ Create installable APK file
4. ✅ Take 10-20 minutes

---

## What to Expect

### Build Process:

```
1. Checking project configuration...
2. Syncing project configuration...
3. Building Android app...
   - Installing dependencies
   - Configuring Gradle
   - Compiling code
   - Building APK
4. Build complete!
```

### Output:

When done, you'll see:
```
✅ Build finished
📦 APK location: /path/to/EventBuddy/android/app/build/outputs/apk/release/app-release.apk
```

---

## After Build Completes

### 1. Find Your APK

The APK will be in:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 2. Install on Your Device

**Option A: USB Cable**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Option B: File Transfer**
1. Copy APK to your phone
2. Open file manager on phone
3. Tap the APK file
4. Allow installation from unknown sources
5. Install

### 3. Test Ads

Open the app and check:
- ✅ Banner ad at bottom of Events screen
- ✅ Interstitial ad after joining 3 events
- ✅ Console logs show ad loading

---

## If Build Fails

### Common Issues:

**Issue 1: Java/Android SDK not found**

Solution:
```bash
# Install Android Studio first
# Then set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Issue 2: Gradle error**

Solution:
```bash
cd android
./gradlew clean
cd ..
eas build --profile local --platform android --local
```

**Issue 3: Out of memory**

Solution:
```bash
# Increase Node memory
export NODE_OPTIONS=--max_old_space_size=4096
eas build --profile local --platform android --local
```

---

## Alternative: Build on EAS Cloud

If local build fails or takes too long:

```bash
# Build on EAS servers (faster, no local setup needed)
eas build --profile development --platform android
```

This builds in the cloud and gives you a download link.

---

## Build Profiles

### Local Profile (Current)
```json
"local": {
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  },
  "distribution": "internal"
}
```

- Builds on your machine
- Creates APK file
- No EAS build credits used

### Development Profile
```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

- Builds on EAS cloud
- Includes dev tools
- Uses EAS build credits

---

## Monitoring Build Progress

The build is running in your terminal. You'll see:

```
⠋ Building Android app...
⠙ Compiling...
⠹ Packaging...
⠸ Finalizing...
✅ Build complete!
```

**Don't close the terminal!** Let it finish.

---

## After Successful Build

### 1. Verify APK Exists

```bash
ls -lh android/app/build/outputs/apk/release/
```

You should see `app-release.apk`

### 2. Check APK Size

```bash
du -h android/app/build/outputs/apk/release/app-release.apk
```

Should be around 50-100 MB

### 3. Install and Test

```bash
# Connect your Android device via USB
# Enable USB debugging on device
adb devices  # Verify device is connected
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## Troubleshooting

### Build Taking Too Long?

- Normal: 10-20 minutes for first build
- Subsequent builds: 5-10 minutes
- Be patient!

### Build Stuck?

- Check terminal for errors
- Press Ctrl+C to cancel
- Try cloud build instead: `eas build --profile development --platform android`

### Can't Install APK?

- Enable "Install from unknown sources" on Android
- Or use: `adb install -r app-release.apk` (force reinstall)

---

## Summary

✅ **Build started** - Running locally
✅ **Ads enabled** - Will work in built APK
✅ **Wait 10-20 minutes** - First build takes time
✅ **APK will be in** - `android/app/build/outputs/apk/release/`

Let the build finish and then install the APK on your device to test ads! 🚀
