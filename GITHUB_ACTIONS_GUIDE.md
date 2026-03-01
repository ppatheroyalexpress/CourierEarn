# GitHub Actions APK Build Guide

## 🚀 Automatic APK Build with GitHub Actions

CourierEarn project ကို GitHub Actions နဲ့ အလိုအလျောက် build လုပ်တဲ့ system ပြင်ဆင်ပြီးပါပြီ။

## 📋 Setup Summary

### ✅ ပြင်ဆင်ပြီးတဲ့ အရာများ

1. **GitHub Actions Workflow** (`.github/workflows/build.yml`)
   - Java 17 setup
   - Gradle cache optimization
   - Keystore creation from secrets
   - Debug & Release APK builds
   - Automatic GitHub Release creation
   - Artifact upload (30 days retention)

2. **Build Configuration**
   - Release signing with keystore
   - APK naming: `CourierEarn-v1.0.apk`
   - Version: v1.0 "Yam"
   - Min SDK: API 21, Target SDK: API 34

3. **Release Automation**
   - Tag creation → Automatic release
   - PR comments with build info
   - Download links in release notes

## 🔧 Required Setup

### Step 1: Create Keystore (Local Machine)
```bash
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Encode Keystore
```bash
# Windows:
certutil -encode release.keystore release.keystore.base64

# Linux/Mac:
base64 release.keystore > release.keystore.base64
```

### Step 3: Add GitHub Secrets
Go to: Repository → Settings → Secrets and variables → Actions

| Secret | Value |
|--------|-------|
| `KEYSTORE_BASE64` | Content of `release.keystore.base64` |
| `KEYSTORE_PASSWORD` | `courierEarn2026` |
| `KEY_ALIAS` | `courierEarn` |
| `KEY_PASSWORD` | `courierEarn2026` |

## 🚀 How It Works

### Triggers:
- **Push to main/master** → Build APKs
- **Create tag (v*)** → Build + Release
- **Pull Request** → Build + Comment
- **Manual** → Build only

### Build Process:
1. **Setup Environment** (Java 17, Gradle)
2. **Create Keystore** from secrets
3. **Build Debug APK** (`CourierEarn-v1.0-debug.apk`)
4. **Build Release APK** (`CourierEarn-v1.0.apk`)
5. **Upload Artifacts** (30 days)
6. **Create Release** (if tagged)
7. **Notify Results**

### Outputs:
- **Debug APK**: ~8-10 MB
- **Release APK**: ~8-10 MB (signed)
- **Release Notes**: Automatic with features
- **Download Links**: GitHub Releases page

## 📱 Getting APKs

### Method 1: GitHub Release (Recommended)
```bash
# Create tag for release
git tag v1.0
git push origin v1.0

# Download from:
# https://github.com/[username]/CourierEarn/releases/tag/v1.0
```

### Method 2: Actions Artifacts
1. Go to GitHub → Actions
2. Select workflow run
3. Download from "Artifacts" section
4. Available for 30 days

### Method 3: Direct Download
```bash
# Release APK:
https://github.com/[username]/CourierEarn/releases/download/v1.0/CourierEarn-v1.0.apk

# Debug APK:
https://github.com/[username]/CourierEarn/releases/download/v1.0/CourierEarn-v1.0-debug.apk
```

## 🔄 Workflow Examples

### Example 1: Normal Development
```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Result: APKs built automatically
# Check: Actions → Latest run → Artifacts
```

### Example 2: Create Release
```bash
# Tag for release
git tag v1.0
git push origin v1.0

# Result: 
# - APKs built
# - GitHub release created
# - APKs uploaded to release
# - Release notes generated
```

### Example 3: Pull Request
```bash
# Create PR
# Result: 
# - APKs built
# - Comment with build info
# - Download links in comment
```

## 📊 Build Information

### APK Details:
- **Name**: CourierEarn-v1.0.apk
- **Version**: 1.0 (versionCode: 1)
- **Min SDK**: API 21 (Android 5.0)
- **Target SDK**: API 34 (Android 14)
- **Architecture**: arm64-v8a, armeabi-v7a
- **Signing**: Release keystore

### Build Environment:
- **OS**: Ubuntu Latest
- **Java**: 17 (Temurin)
- **Gradle**: 8.0+
- **Android SDK**: API 34
- **Build Time**: ~5-10 minutes

## 🔍 Monitoring Builds

### Check Build Status:
1. GitHub → Actions tab
2. Select workflow run
3. View build logs
4. Check artifacts section

### Build Notifications:
- **Success**: Green checkmark
- **Failure**: Red X with error logs
- **PR Comments**: Build results and APK info

## 🛠️ Troubleshooting

### Common Issues:

#### 1. "Secret not found"
**Solution**: Add required secrets in repository settings

#### 2. "Keystore password incorrect"
**Solution**: Verify `KEYSTORE_PASSWORD` and `KEY_PASSWORD`

#### 3. "Build failed"
**Solution**: Check build logs in Actions tab

#### 4. "Artifact not found"
**Solution**: Wait for build completion, check artifacts section

### Debug Commands:
```bash
# Local test
./gradlew assembleDebug
./gradlew assembleRelease

# Check keystore
keytool -list -v -keystore release.keystore
```

## 📋 Quick Start Checklist

- [ ] Keystore created locally
- [ ] Keystore base64 encoded
- [ ] GitHub secrets added
- [ ] Workflow file committed
- [ ] GitHub Actions enabled
- [ ] Test push completed

## 🎯 Benefits

### ✅ Advantages:
- **Automatic builds** on every push
- **No local Java setup** required
- **Consistent builds** across environments
- **Automatic releases** with tags
- **Artifact storage** for 30 days
- **Build notifications** and comments
- **Version control** integration

### 📈 Workflow Improvement:
- **Before**: Manual build, manual upload
- **After**: Push → Automatic build → Download

## 🔄 Maintenance

### Regular Tasks:
- **Update secrets** if keystore changes
- **Monitor build times** and optimize
- **Clean old artifacts** (auto after 30 days)
- **Update workflow** for new features

### Security:
- **Rotate secrets** periodically
- **Limit secret access** to maintainers
- **Monitor workflow logs** for sensitive data

---

## 🚀 Ready to Use!

**Setup ပြီးရင်:**

1. **Add GitHub secrets** (keystore info)
2. **Push to main** → APKs build automatically
3. **Create tag v1.0** → Release created automatically
4. **Download APKs** from GitHub Releases

**အခုနောက် push လုပ်တိုင်းတောင် APK အလိုအလျောက် build လုပ်ပေးမှာ ဖြစ်ပါတယ်! 🎉**
