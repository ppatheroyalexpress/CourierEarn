# CourierEarn v1.0 "Yam" - Release Notes

## 🎉 First Official Release

**Version:** v1.0 "Yam"  
**Release Date:** February 28, 2026  
**APK Name:** CourierEarn-v1.0.apk  
**Build Type:** Release (Signed)  
**Min SDK:** API 21 (Android 5.0)  
**Target SDK:** API 34 (Android 14)

---

## ✨ Features

### 📊 Daily Data Entry
- Track Cash Collect, Sender Pay, Rejected, and FOC deliveries
- Add EC Bonus for additional earnings
- Real-time commission calculation
- Input validation and error handling
- Data persistence with local database

### 💰 Commission Calculation
- Automatic calculation: Cash Collect (200 MMK), Sender Pay (100 MMK)
- Daily total computation with EC Bonus
- Monthly progress tracking
- Statistics and summaries
- Accurate financial reporting

### 📅 Calendar View
- Monthly calendar with color-coded days
- Visual indicators for data presence and off days
- Navigate between months
- Quick overview of delivery history
- Interactive date selection

### 📈 Reports & Analytics
- Weekly and monthly PDF reports
- Detailed transaction tables
- Earnings summaries and statistics
- Professional report layouts with iText7
- Export to Downloads/CourierEarn folder

### 🖨️ Bluetooth Printing
- 58mm thermal printer support
- ESC/POS protocol integration
- Today's receipt printing
- Daily summary reports
- Printer discovery and connection
- Custom receipt layouts

### ⏰ Reminder System
- Daily 8 PM reminders
- WorkManager background scheduling
- Notification system
- Data existence checking
- Settings integration
- Test reminder functionality

---

## 🎨 UI/UX Improvements

### Loading States
- Consistent loading indicators across all screens
- Skeleton loading for better perceived performance
- Progress indicators with percentages
- Context-specific loading messages

### Error Handling
- User-friendly error messages
- Specific error types and recovery actions
- Interactive error recovery dialogs
- Step-by-step troubleshooting guides
- Quick action buttons for common fixes

### Empty States
- Contextual empty states with illustrations
- Actionable empty states with clear next steps
- Educational content to guide users
- Consistent visual design language

### Animations
- Smooth transitions between states
- Micro-interactions for better UX
- Loading animations and progress indicators
- Success and error state animations
- Staggered animations for lists

---

## 🔧 Technical Specifications

### Architecture
- MVVM with Clean Architecture
- Hilt for dependency injection
- Room database for local storage
- Jetpack Compose for UI
- Coroutines for async operations

### Dependencies
- Android SDK 34
- Kotlin 1.8
- Material Design 3
- iText7 for PDF generation
- ESC/POS for thermal printing
- WorkManager for background tasks

### Security
- Code obfuscation with ProGuard
- Signed APK for distribution
- Local data encryption
- Secure permission handling

---

## 📱 Device Compatibility

### Minimum Requirements
- Android 5.0 (API 21) and above
- 2GB RAM minimum
- Bluetooth 4.0+ for printing
- External storage access for exports

### Recommended
- Android 10+ (API 29+)
- 4GB RAM or more
- Stable internet connection
- Compatible 58mm thermal printer

---

## 🐛 Bug Fixes

### Critical Fixes
- Data entry validation improvements
- Commission calculation overflow handling
- Bluetooth permission fixes
- Storage permission handling
- Reminder system persistence

### UI/UX Fixes
- Loading state consistency
- Error message improvements
- Empty state enhancements
- Animation performance optimization
- Memory leak fixes

---

## 🔐 Permissions

### Required Permissions
- `BLUETOOTH` - Printer connectivity
- `BLUETOOTH_ADMIN` - Printer management
- `ACCESS_FINE_LOCATION` - Bluetooth scanning
- `WRITE_EXTERNAL_STORAGE` - PDF export
- `READ_EXTERNAL_STORAGE` - Data backup
- `POST_NOTIFICATIONS` - Daily reminders
- `SCHEDULE_EXACT_ALARM` - Reminder scheduling

### Optional Permissions
- `ACCESS_COARSE_LOCATION` - Bluetooth scanning (fallback)

---

## 📦 Installation

### Prerequisites
- Android 5.0 or higher
- Enable "Unknown Sources" in settings
- Minimum 100MB free storage

### Steps
1. Download `CourierEarn-v1.0.apk`
2. Enable installation from unknown sources
3. Tap on the APK file
4. Follow installation prompts
5. Grant required permissions
6. Launch the app

---

## 🚀 Getting Started

### First Time Setup
1. Open CourierEarn app
2. Grant required permissions
3. Navigate to Home screen
4. Tap "Add Data" to enter first delivery
5. Explore Calendar, Reports, and Settings

### Daily Usage
1. Enter daily delivery data
2. View monthly progress in Calendar
3. Generate reports when needed
4. Print receipts for records
5. Enable daily reminders

---

## 📞 Support

### Troubleshooting
- Check permissions in Settings
- Ensure Bluetooth is enabled for printing
- Verify storage access for exports
- Restart app if issues persist

### Contact
- Report bugs via GitHub Issues
- Feature requests welcome
- Documentation available in app

---

## 🔄 What's Next

### v1.1 Planned Features
- Cloud backup and sync
- Multiple printer profiles
- Advanced reporting filters
- Data import/export options
- Performance optimizations

### Long-term Roadmap
- Web dashboard
- Team management
- Route optimization
- Expense tracking
- Analytics dashboard

---

## 📄 Legal

### Privacy
- No data shared with third parties
- Local storage only
- No analytics or tracking
- User data ownership

### License
- Proprietary software
- For internal use only
- Distribution restrictions apply

---

**Thank you for using CourierEarn! 🚚💨**

*Version 1.0 "Yam" - Named after the Burmese word for "rice", symbolizing daily sustenance and earnings.*
