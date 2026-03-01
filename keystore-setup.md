# Keystore Setup for GitHub Actions

## 🔐 Keystore Information

Since Java is not available in this environment, you need to create the keystore on your local machine.

### Step 1: Create Keystore (Local Machine)

Open Command Prompt/PowerShell and run:

```bash
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000 -storepass courierEarn2026 -keypass courierEarn2026 -dname "CN=CourierEarn, OU=PPA, O=PPA, L=Yangon, ST=Yangon, C=MM"
```

### Step 2: Convert to Base64

```bash
# Windows:
certutil -encode release.keystore release.keystore.base64

# Linux/Mac:
base64 release.keystore > release.keystore.base64
```

### Step 3: Add GitHub Secrets

Go to your GitHub repository:
1. Settings → Secrets and variables → Actions
2. Click "New repository secret" and add:

| Secret Name | Value |
|-------------|-------|
| `KEYSTORE_BASE64` | **Copy entire content of `release.keystore.base64` file** |
| `KEYSTORE_PASSWORD` | `courierEarn2026` |
| `KEY_ALIAS` | `courierEarn` |
| `KEY_PASSWORD` | `courierEarn2026` |

### Step 4: Push to Trigger Build

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

### Step 5: Check GitHub Actions

1. Go to GitHub → Actions tab
2. Wait for build to complete (5-10 minutes)
3. Download APK from Artifacts section

## 📱 Expected APK Files

After successful build:
- **Debug APK**: `CourierEarn-v1.0-debug.apk`
- **Release APK**: `CourierEarn-v1.0.apk`

## 🔍 Troubleshooting

### If keytool not found:
1. Install Java JDK 8 or higher
2. Set JAVA_HOME environment variable
3. Add Java to PATH

### If build fails:
1. Check GitHub Secrets are correct
2. Verify Base64 encoding
3. Check Actions tab for error logs

## 🚀 Quick Commands

```bash
# Create keystore
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000 -storepass courierEarn2026 -keypass courierEarn2026 -dname "CN=CourierEarn, OU=PPA, O=PPA, L=Yangon, ST=Yangon, C=MM"

# Convert to base64
certutil -encode release.keystore release.keystore.base64

# Push to trigger build
git add .
git commit -m "Setup GitHub Actions"
git push origin main
```

---

**After setup, every push will automatically build APKs! 🚀**
