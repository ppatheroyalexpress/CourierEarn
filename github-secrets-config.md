# GitHub Secrets Configuration

## 🔐 Keystore Details

**Pre-generated Keystore Information:**
- Keystore password: courierEarn2026
- Key alias: courierEarn
- Key password: courierEarn2026
- First and Last Name: CourierEarn
- Organizational Unit: Development
- Organization: PPA
- City/Locality: Mandalay
- State/Province: Mandalay
- Country Code: MM

## 📋 GitHub Secrets to Add

Go to: Repository → Settings → Secrets and variables → Actions → New repository secret

### Required Secrets:

| Secret Name | Value |
|-------------|-------|
| `KEYSTORE_BASE64` | **(Base64 encoded keystore content)** |
| `KEYSTORE_PASSWORD` | `courierEarn2026` |
| `KEY_ALIAS` | `courierEarn` |
| `KEY_PASSWORD` | `courierEarn2026` |

## 🔧 Setup Commands

### Create Keystore (Local):
```bash
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000 -storepass courierEarn2026 -keypass courierEarn2026 -dname "CN=CourierEarn, OU=Development, O=PPA, L=Mandalay, ST=Mandalay, C=MM"
```

### Convert to Base64:
```bash
# Windows:
certutil -encode release.keystore release.keystore.base64

# Linux/Mac:
base64 release.keystore > release.keystore.base64
```

## 🚀 After Setup

1. Add all 4 secrets to GitHub repository
2. Push code to main branch
3. GitHub Actions will automatically build APKs
4. Download from Actions → Artifacts section

## 📱 Expected Output

- **Debug APK**: CourierEarn-v1.0-debug.apk
- **Release APK**: CourierEarn-v1.0.apk
- **Build Time**: 5-10 minutes
- **Retention**: 30 days
