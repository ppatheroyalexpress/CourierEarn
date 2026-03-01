# GitHub Secrets Setup Guide

## 🔐 Required GitHub Secrets

GitHub Actions ကိုအလုပ်လုပ်ဖို့အတွက် အောက်ဖော်ပြထားတဲ့ secrets တွေကို setup လုပ်ရပါမယ်။

### 1. Keystore ဖန်တီးပါ (Local Machine မှာ)

```bash
# Keystore ဖန်တီးပါ
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000

# Information တွေကိုဖြည့်ပါ:
# Keystore password: courierEarn2026
# Key password: courierEarn2026
# Alias: courierEarn
# Name: CourierEarn
# Organization: PPA
# City: Yangon
# Country: MM
```

### 2. Keystore ကို Base64 ပြောင်းပါ

```bash
# Windows မှာ:
certutil -encode release.keystore release.keystore.base64

# Linux/Mac မှာ:
base64 release.keystore > release.keystore.base64
```

### 3. GitHub Repository မှာ Secrets ထည့်ပါ

1. GitHub Repository ကိုသွားပါ
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** ကိုနှိပ်ပါ
4. အောက်ဖော်ပြထားတဲ့ secrets တွေကိုထည့်ပါ

#### Required Secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `KEYSTORE_BASE64` | `release.keystore.base64` ဖိုင်ရဲ့ content | Base64 encoded keystore |
| `KEYSTORE_PASSWORD` | `courierEarn2026` | Keystore password |
| `KEY_ALIAS` | `courierEarn` | Key alias |
| `KEY_PASSWORD` | `courierEarn2026` | Key password |

### 4. Secrets ထည့်ပုံအသေးစိတ်

#### KEYSTORE_BASE64:
```bash
# release.keystore.base64 ဖိုင်ကိုဖွင့်ပြီး content အားလုံးကို copy လုပ်ပါ
# ဥပမာ:
uQIAAAABAAEADC... (အရှည်လိုက်တဲ့ base64 string)
```

#### KEYSTORE_PASSWORD:
```
courierEarn2026
```

#### KEY_ALIAS:
```
courierEarn
```

#### KEY_PASSWORD:
```
courierEarn2026
```

## 🚀 GitHub Actions အလုပ်လုပ်ပုံ

### Trigger Events:
- **Push to main/master branch** → Debug & Release APK build
- **Create tag (v*)** → Build + GitHub Release
- **Pull Request** → Build only
- **Manual trigger** → Build only

### Build Process:
1. **Setup Java 17**
2. **Cache Gradle** (ပိုမြန်အောင်)
3. **Create keystore** from secrets
4. **Build Debug APK**
5. **Build Release APK**
6. **Upload artifacts** (30 days retention)
7. **Create GitHub Release** (tag ဖန်တီးရင်)
8. **Comment on PR** (build result)

### Output Files:
- **Debug APK**: `CourierEarn-v1.0-debug.apk`
- **Release APK**: `CourierEarn-v1.0.apk`

## 📱 APK ရယူနည်း

### Method 1: GitHub Release (Recommended)
```bash
# Tag ဖန်တီးပါ
git tag v1.0
git push origin v1.0

# Release ကိုဝင်ပြီး APK ကို download လုပ်ပါ
# https://github.com/[username]/CourierEarn/releases/tag/v1.0
```

### Method 2: Actions Artifacts
1. GitHub → Actions → Select workflow run
2. **Artifacts** ကိုနှိပ်ပါ
3. APK ဖိုင်ကို download လုပ်ပါ

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Keystore password incorrect"
- **Solution**: Secrets တွေကိုပြန်စစ်ပါ
- `KEYSTORE_PASSWORD` နဲ့ `KEY_PASSWORD` ကိုစစ်ပါ

#### 2. "Base64 decode failed"
- **Solution**: `KEYSTORE_BASE64` ကိုပြန်ထည့်ပါ
- Base64 string ကိုအပြည့် copy လုပ်ပါ

#### 3. "Build failed"
- **Solution**: Actions tab မှာ build log ကိ်ုကြည့်ပါ
- Error message ကိုစစ်ပါ

#### 4. "Gradle permission denied"
- **Solution**: Workflow ထဲက `chmod +x gradlew` ကိုစစ်ပါ

### Debug Commands:
```bash
# Local မှာ test လုပ်ချင်ရင်:
./gradlew assembleDebug
./gradlew assembleRelease

# Keystore စစ်ချင်ရင်:
keytool -list -v -keystore release.keystore
```

## 📋 Setup Checklist

- [ ] Java JDK 17 ထည့်ပြီးသား
- [ ] Keystore ဖန်တီးပြီးသား
- [ ] Base64 encode လုပ်ပြီးသား
- [ ] GitHub secrets အားလုံးထည့်ပြီးသား
- [ ] `.github/workflows/build.yml` ဖိုင်ရှိပြီးသား
- [ ] GitHub Actions enabled ဖြစ်ပြီးသား

## 🎯 Quick Start

```bash
# 1. Keystore ဖန်တီး
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000

# 2. Base64 ပြောင်း
certutil -encode release.keystore release.keystore.base64

# 3. GitHub မှာ secrets ထည့်
# Settings → Secrets and variables → Actions → New repository secret

# 4. Push လုပ်ပြီး build စောင့်
git add .
git commit -m "Add GitHub Actions for APK build"
git push origin main

# 5. Actions tab မှာ build ကိုကြည့်ပါ
```

## 🔄 Workflow အလုပ်လုပ်ပုံ

```
Push to main → GitHub Actions Trigger → Build APK → Upload Artifacts
Create tag v1.0 → Build APK → Create GitHub Release → Upload APK
```

---

**Setup ပြီးရင် push လုပ်တိုင်းတောင် APK အလိုအလျောက် build လုပ်ပေးမှာ ဖြစ်ပါတယ်! 🚀**
