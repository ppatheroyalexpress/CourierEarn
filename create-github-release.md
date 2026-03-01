# GitHub Release Creation Guide

## 🚀 Creating GitHub Release for CourierEarn v1.0

### Prerequisites
- GitHub CLI installed and authenticated
- APK file built and ready
- Release notes prepared

### Steps to Create Release

#### 1. Create Release Tag
```bash
git tag v1.0
git push origin v1.0
```

#### 2. Create GitHub Release
```bash
gh release create v1.0 \
  --title "CourierEarn v1.0 'Yam' - First Release" \
  --notes-file RELEASE_NOTES.md \
  --target main \
  --latest
```

#### 3. Upload APK
```bash
gh release upload v1.0 app/build/outputs/apk/release/CourierEarn-v1.0.apk \
  --clobber
```

### Alternative: Manual GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Fill in release details:
   - **Tag version**: v1.0
   - **Release title**: CourierEarn v1.0 "Yam" - First Release
   - **Description**: Copy from RELEASE_NOTES.md
   - **Target**: main branch
   - **Mark as latest release**: ✅
4. Upload APK file:
   - Drag and drop `CourierEarn-v1.0.apk`
   - File should be in `app/build/outputs/apk/release/`
5. Click "Publish release"

### Release Information

**Release Details:**
- **Tag**: v1.0
- **Title**: CourierEarn v1.0 "Yam" - First Release
- **Description**: First official release of CourierEarn Android App. Features: Daily Data Entry, Commission Calculation, Calendar, Reports, PDF Export, Bluetooth Print, Reminder System.
- **Assets**: CourierEarn-v1.0.apk (Signed Release Build)
- **Target Branch**: main
- **Latest Release**: Yes

### APK Information
- **File Name**: CourierEarn-v1.0.apk
- **Size**: ~8-12 MB (estimated)
- **Type**: Signed Release APK
- **Min SDK**: API 21
- **Target SDK**: API 34
- **Version Code**: 1
- **Version Name**: 1.0

### Post-Release Actions
1. Verify APK download works
2. Test installation on different devices
3. Monitor for any issues
4. Update documentation if needed
5. Prepare for v1.1 development

### Release Checklist
- [ ] APK built successfully
- [ ] APK signed and obfuscated
- [ ] Release notes finalized
- [ ] Tag created and pushed
- [ ] GitHub release created
- [ ] APK uploaded to release
- [ ] Release marked as latest
- [ ] Download tested
- [ ] Installation verified
- [ ] Documentation updated

### Release URL Format
```
https://github.com/username/CourierEarn/releases/tag/v1.0
```

### Download URL Format
```
https://github.com/username/CourierEarn/releases/download/v1.0/CourierEarn-v1.0.apk
```
