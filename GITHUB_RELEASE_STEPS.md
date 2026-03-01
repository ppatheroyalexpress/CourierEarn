# GitHub Release - Manual Creation Steps

## 🚀 CourierEarn v1.0 "Yam" GitHub Release

### Step 1: Build the APK (Local Machine Required)

Since Java is not available in this environment, you need to build the APK on your local machine:

#### Prerequisites:
- Java JDK 8 or higher installed
- Android Studio or Gradle installed

#### Build Commands:
```bash
# Navigate to project directory
cd "d:\MY TECH JOURNEY 2026\VIBE CODING\Test 02\CourierEarn"

# Clean and build release APK
gradlew clean
gradlew assembleRelease

# APK will be at:
# app/build/outputs/apk/release/CourierEarn-v1.0.apk
```

### Step 2: Create Git Tag

```bash
# Create tag for v1.0
git tag v1.0
git push origin v1.0
```

### Step 3: Create GitHub Release

#### Method A: Using GitHub CLI (Recommended)

```bash
# Create release
gh release create v1.0 \
  --title "CourierEarn v1.0 'Yam' - First Public Release" \
  --notes-file GITHUB_RELEASE_NOTES.md \
  --target main \
  --latest \
  --public

# Upload APK
gh release upload v1.0 app/build/outputs/apk/release/CourierEarn-v1.0.apk
```

#### Method B: Using GitHub Web Interface

1. Go to your GitHub repository: `https://github.com/[username]/CourierEarn`
2. Click on **Releases** tab
3. Click **"Create a new release"** button
4. Fill in the release details:

   **Choose a tag:** `v1.0`
   **Target:** `main`
   
   **Release title:**
   ```
   CourierEarn v1.0 "Yam" - First Public Release
   ```
   
   **Describe this release:**
   ```markdown
   # CourierEarn v1.0 "Yam"
   
   Courier Commission Tracker App for couriers to track daily earnings.
   
   ## ✨ Features
   - ✅ Daily Data Entry (Cash Collect 200 MMK, Sender Pay 100 MMK)
   - ✅ Extra Care (EC) Tracking (600 MMK monthly bonus)
   - ✅ Monthly Calculation (1st to last day)
   - ✅ Material Design 3 UI
   - ✅ Calendar View with color-coded days
   - ✅ PDF Export (Weekly & Monthly Reports)
   - ✅ Bluetooth Print (58mm Thermal Printer)
   - ✅ Daily Reminder (8 PM with WorkManager)
   - ✅ Offline-first with Room Database
   - ✅ JSON Backup & Restore
   
   ## 📱 Screenshots
   (Screenshots မရှိသေးရင် ဒီနေရာမှာချန်ထားပါ)
   
   ## 📲 Installation
   1. Download CourierEarn-v1.0.apk
   2. Enable "Install from unknown sources" in settings
   3. Open APK and install
   4. Start tracking your commissions!
   
   ## 🛠️ Technical Details
   - Min SDK: API 21 (Android 5.0+)
   - Target SDK: API 34
   - Architecture: MVVM with Clean Architecture
   - Database: Room
   - Background: WorkManager
   - PDF: iText7
   - Printing: ESC/POS
   
   ## ⚠️ Disclaimer
   This app is for educational purposes only. Not affiliated with Royal Express Co., Ltd. Actual commission may vary based on company SOP.
   
   ## 👤 Developer
   PPA | 30 (Chanmyathazi East Section)
   ```

5. Upload the APK:
   - Drag and drop `CourierEarn-v1.0.apk` or click to browse
   - File should be ~8-12 MB

6. **Make sure to check:**
   - ✅ Set as the latest release
   - ✅ Public release (not draft)

7. Click **"Publish release"**

### Step 4: Verify Release

After publishing:

1. **Check the release URL:**
   ```
   https://github.com/[username]/CourierEarn/releases/tag/v1.0
   ```

2. **Verify download works:**
   - Click on the APK file
   - Should start downloading

3. **Verify APK installs:**
   - Transfer to Android device
   - Enable "Unknown Sources"
   - Install and test

### Release Information Summary

| Field | Value |
|-------|-------|
| **Tag** | v1.0 |
| **Title** | CourierEarn v1.0 "Yam" - First Public Release |
| **Description** | Features list, installation guide, technical details |
| **Assets** | CourierEarn-v1.0.apk |
| **Visibility** | Public |
| **Latest** | Yes |
| **Target** | main branch |

### Download URL

Once released, the download URL will be:
```
https://github.com/[username]/CourierEarn/releases/download/v1.0/CourierEarn-v1.0.apk
```

### Troubleshooting

**If build fails:**
1. Check Java installation: `java -version`
2. Check Gradle installation: `gradlew --version`
3. Check Android SDK is installed
4. Verify keystore exists

**If GitHub CLI not installed:**
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Login to GitHub
gh auth login
```

**If release already exists:**
- Delete old v1.0 tag: `git push origin --delete v1.0`
- Delete old release on GitHub
- Re-create with same steps

### Quick Commands Summary

```bash
# Build APK
cd "d:\MY TECH JOURNEY 2026\VIBE CODING\Test 02\CourierEarn"
gradlew clean
gradlew assembleRelease

# Create tag
git tag v1.0
git push origin v1.0

# Create release (CLI)
gh release create v1.0 --title "CourierEarn v1.0 'Yam' - First Public Release" --notes-file GITHUB_RELEASE_NOTES.md --latest --public

# Upload APK
gh release upload v1.0 app/build/outputs/apk/release/CourierEarn-v1.0.apk
```

---

**Ready to release CourierEarn v1.0! 🎉**

All configuration files are ready. Just run the build commands and create the GitHub release.
