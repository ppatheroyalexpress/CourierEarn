@echo off
echo Creating Keystore for CourierEarn GitHub Actions...

REM Set variables
set KEYSTORE_FILE=release.keystore
set KEYSTORE_PASSWORD=courierEarn2026
set KEY_ALIAS=courierEarn
set KEY_PASSWORD=courierEarn2026
set VALIDITY=10000

REM Create keystore
keytool -genkey -v -keystore %KEYSTORE_FILE% -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity %VALIDITY% -storepass %KEYSTORE_PASSWORD% -keypass %KEY_PASSWORD% -dname "CN=CourierEarn, OU=PPA, O=PPA, L=Yangon, ST=Yangon, C=MM"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Keystore created successfully!
    echo File: %KEYSTORE_FILE%
    echo Alias: %KEY_ALIAS%
    echo Validity: %VALIDITY% days
    echo.
    
    REM Convert to Base64
    echo Converting keystore to Base64...
    certutil -encode %KEYSTORE_FILE% %KEYSTORE_FILE%.base64
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Base64 conversion successful!
        echo Base64 file: %KEYSTORE_FILE%.base64
        echo.
        echo 📋 Copy the content of %KEYSTORE_FILE%.base64 for GitHub Secrets
        echo.
        echo Required GitHub Secrets:
        echo - KEYSTORE_BASE64: (content of %KEYSTORE_FILE%.base64)
        echo - KEYSTORE_PASSWORD: %KEYSTORE_PASSWORD%
        echo - KEY_ALIAS: %KEY_ALIAS%
        echo - KEY_PASSWORD: %KEY_PASSWORD%
        echo.
        echo 📝 Next steps:
        echo 1. Open %KEYSTORE_FILE%.base64 and copy all content
        echo 2. Go to GitHub repository Settings → Secrets and variables → Actions
        echo 3. Add the 4 secrets listed above
        echo 4. Push code to trigger GitHub Actions
        echo.
    ) else (
        echo ❌ Base64 conversion failed!
    )
) else (
    echo ❌ Keystore creation failed!
    echo Please check if Java is installed and keytool is available.
)

pause
