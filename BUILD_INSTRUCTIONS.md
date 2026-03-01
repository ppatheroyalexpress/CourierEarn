# CourierEarn APK Build Instructions

## 🔨 Building the Release APK

### Prerequisites
1. **Java Development Kit (JDK)** - Java 8 or higher
2. **Android SDK** - API 34 installed
3. **Gradle** - Version 8.0+
4. **Keystore File** - For signing the release APK

### Environment Setup

#### 1. Set JAVA_HOME
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-11.0.x.x

# Or add to System Environment Variables
```

#### 2. Verify Java Installation
```bash
java -version
javac -version
```

#### 3. Create Keystore (if not exists)
```bash
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000
```

### Build Process

#### Method 1: Using Gradle Wrapper (Recommended)
1. **Navigate to project root**
```bash
cd "d:\MY TECH JOURNEY 2026\VIBE CODING\Test 02\CourierEarn"
```

2. **Clean previous builds**
```bash
gradlew clean
```

3. **Build release APK**
```bash
gradlew assembleRelease
```

#### Method 2: Using Android Studio
1. **Open project in Android Studio**
2. **Build → Generate Signed Bundle/APK**
3. **Select APK**
4. **Choose keystore file**
5. **Enter keystore passwords**
6. **Select release variant**
7. **Finish**

#### Method 3: Using Batch Script
1. **Run the build script**
```bash
build-apk.bat
```

### Build Configuration

#### Release Build Settings
- **Minify Enabled**: Yes (code obfuscation)
- **ProGuard Rules**: Configured for all dependencies
- **Signing Config**: Release keystore
- **Debuggable**: No
- **Version Code**: 1
- **Version Name**: 1.0

#### APK Output
- **Location**: `app/build/outputs/apk/release/`
- **File Name**: `CourierEarn-v1.0.apk`
- **Type**: Signed Release APK
- **Size**: ~8-12 MB

### Troubleshooting

#### Common Issues

1. **JAVA_HOME not set**
   - Solution: Set JAVA_HOME environment variable
   - Path: `C:\Program Files\Java\jdk-11.0.x.x`

2. **Gradle not found**
   - Solution: Use gradlew wrapper script
   - Ensure gradlew.bat exists in project root

3. **Keystore issues**
   - Solution: Verify keystore file exists
   - Check passwords in keystore.properties

4. **Permission denied**
   - Solution: Run as administrator
   - Check file permissions

5. **Build fails**
   - Solution: Check build logs
   - Verify all dependencies are available

#### Build Log Locations
- **Gradle logs**: `app/build/logs/`
- **Console output**: Terminal window
- **Error details**: `build/reports/`

### Verification

#### 1. Check APK Exists
```bash
dir app\build\outputs\apk\release\
```

#### 2. Verify APK Signature
```bash
jarsigner -verify -verbose -certs app\build\outputs\apk\release\CourierEarn-v1.0.apk
```

#### 3. Test APK Installation
- Transfer APK to Android device
- Enable "Unknown Sources" in settings
- Install and test functionality

### Release Checklist

#### Pre-Build
- [ ] All tests passing
- [ ] Code review completed
- [ ] Dependencies updated
- [ ] ProGuard rules configured
- [ ] Keystore ready

#### Post-Build
- [ ] APK generated successfully
- [ ] APK signed correctly
- [ ] APK size within limits
- [ ] Installation tested
- [ ] Core functionality verified

### Automated Build Script

#### build-apk.bat Content
```batch
@echo off
echo Building CourierEarn APK...

REM Clean previous builds
call gradlew clean

REM Build release APK
call gradlew assembleRelease

echo APK build completed!
echo Check app\build\outputs\apk\release directory for the APK

pause
```

### Gradle Commands Reference

#### Useful Commands
```bash
# Clean build
gradlew clean

# Build debug APK
gradlew assembleDebug

# Build release APK
gradlew assembleRelease

# Build with specific signing
gradlew assembleRelease -PkeystoreFile=release.keystore -PkeystorePassword=password -PkeyAlias=alias -PkeyPassword=password

# Generate signed bundle
gradlew bundleRelease

# Run tests
gradlew test

# Check dependencies
gradlew dependencies
```

### Environment Variables

#### Required Variables
- `JAVA_HOME` - Java installation path
- `ANDROID_HOME` - Android SDK path (optional)
- `GRADLE_HOME` - Gradle home (optional)

#### Signing Variables
- `keystoreFile` - Path to keystore file
- `keystorePassword` - Keystore password
- `keyAlias` - Key alias
- `keyPassword` - Key password

### Final Steps

1. **Locate APK**: `app/build/outputs/apk/release/CourierEarn-v1.0.apk`
2. **Test Installation**: Install on test device
3. **Verify Functionality**: Test all major features
4. **Create GitHub Release**: Upload APK and release notes
5. **Update Documentation**: Update README and version info

---

**Build Success! 🎉**

Your CourierEarn v1.0 APK is ready for distribution!
