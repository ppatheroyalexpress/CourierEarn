@echo off
echo ========================================
echo CourierEarn GitHub Actions Setup
echo ========================================
echo.

echo Step 1: Checking Java installation...
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Java not found. Please install Java JDK first.
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java found
)

echo.
echo Step 2: Creating keystore...
keytool -genkey -v -keystore release.keystore -alias courierEarn -keyalg RSA -keysize 2048 -validity 10000 -storepass courierEarn2026 -keypass courierEarn2026 -dname "CN=CourierEarn, OU=PPA, O=PPA, L=Yangon, ST=Yangon, C=MM"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Keystore creation failed!
    pause
    exit /b 1
) else (
    echo ✅ Keystore created successfully
)

echo.
echo Step 3: Converting to Base64...
certutil -encode release.keystore release.keystore.base64

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Base64 conversion failed!
    pause
    exit /b 1
) else (
    echo ✅ Base64 conversion successful
)

echo.
echo Step 4: Displaying Base64 content...
echo ========================================
echo Copy the entire content below for KEYSTORE_BASE64:
echo ========================================
type release.keystore.base64
echo ========================================
echo End of Base64 content
echo ========================================

echo.
echo Step 5: GitHub Secrets to add:
echo.
echo Repository → Settings → Secrets and variables → Actions → New repository secret
echo.
echo Required Secrets:
echo - KEYSTORE_BASE64: (Copy entire content shown above)
echo - KEYSTORE_PASSWORD: courierEarn2026
echo - KEY_ALIAS: courierEarn
echo - KEY_PASSWORD: courierEarn2026
echo.

echo Step 6: After adding secrets, run:
echo git add .
echo git commit -m "Setup GitHub Actions"
echo git push origin main
echo.

echo ========================================
echo Setup completed! 🎉
echo ========================================
echo.
echo Next:
echo 1. Add GitHub secrets as shown above
echo 2. Push code to trigger build
echo 3. Check GitHub Actions tab for build progress
echo 4. Download APK from Artifacts section
echo.

pause
