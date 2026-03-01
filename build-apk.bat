@echo off
echo Building CourierEarn APK...

REM Clean previous builds
call gradlew clean

REM Build release APK
call gradlew assembleRelease

echo APK build completed!
echo Check app\build\outputs\apk\release directory for the APK

pause
