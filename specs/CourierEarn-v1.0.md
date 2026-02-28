# CourierEarn v1.0 "Yam" - Android App Specification

## App Information

- **App Name**: CourierEarn
- **Version**: v1.0 "Yam"
- **User**: PPA | 30 (Chanmyathazi East)
- **Platform**: Android
- **Architecture**: MVVM with Clean Architecture

## Core Features

### Daily Data Entry
The app allows couriers to track their daily earnings with the following transaction types:

- **Cash Collect**: 200 MMK per transaction
- **Sender Pay**: 100 MMK per transaction  
- **Rejected/FOC**: 0 MMK per transaction
- **EC Count**: Count only (calculated at month end)

### Calculation System
- **Period**: Monthly (1st day to last day of each month)
- **EC Calculation**: 600 MMK per piece, added at month end
- **Daily Totals**: Automatic calculation of daily earnings
- **Monthly Summary**: Comprehensive monthly earnings report

## User Interface

### Design System
- **Design Language**: Material Design 3
- **Theme**: Modern, clean interface with dynamic colors
- **Navigation**: Bottom navigation with 5 main sections

### Screens

#### 1. Home Screen
- Today's summary overview
- Quick stats (total deliveries, total earnings)
- Quick action buttons for data entry
- Monthly progress indicator

#### 2. Data Entry Screen
- Transaction type selection (Cash Collect, Sender Pay, Rejected/FOC, EC)
- Quantity input fields
- Date selector (defaults to today)
- Save/Cancel actions
- Entry history for current day

#### 3. Calendar Screen
- Monthly calendar view
- Daily earnings indicators
- Tap to view detailed breakdown
- Navigation between months

#### 4. Reports Screen
- Monthly earnings summary
- Weekly earnings view
- Transaction type breakdown
- Export options (PDF, Print)

#### 5. Settings Screen
- User profile management
- Reminder settings
- Backup/Restore options
- App preferences
- About section

## Export Features

### PDF Export
- **Monthly Reports**: Complete monthly earnings statement
- **Weekly Reports**: Weekly earnings summaries
- **Format**: Professional PDF with company branding
- **Content**: Transaction details, totals, EC calculations

### Bluetooth Printing
- **Printer Support**: 58mm thermal printers
- **Protocol**: ESC/POS
- **Content**: Daily/monthly receipts
- **Format**: Compact thermal print format

### Data Backup
- **Format**: JSON
- **Content**: All transaction data and settings
- **Location**: Local storage/external backup
- **Restore**: Import backup data functionality

## Reminder System

### Daily Reminder
- **Time**: 8:00 PM daily
- **Purpose**: Remind users to enter daily data
- **Technology**: Android WorkManager
- **Customization**: Enable/disable, time adjustment
- **Notification**: Persistent notification with quick action

## Technical Stack

### Core Technologies
- **Language**: Kotlin
- **Architecture**: MVVM (Model-View-ViewModel)
- **Database**: Room (SQLite)
- **Dependency Injection**: Hilt
- **Background Tasks**: WorkManager

### Libraries & Dependencies
- **UI**: Material Design 3 Components
- **PDF Generation**: iText7
- **Bluetooth Printing**: ESC/POS library
- **Date Handling**: java.time (Java 8+)
- **Charts**: MPAndroidChart (for reports visualization)
- **Navigation**: Navigation Component

### Project Structure
```
app/
├── src/main/java/com/courierearn/
│   ├── data/
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   ├── dao/
│   │   │   └── AppDatabase.kt
│   │   ├── repository/
│   │   └── preferences/
│   ├── domain/
│   │   ├── model/
│   │   ├── repository/
│   │   └── usecase/
│   ├── presentation/
│   │   ├── ui/
│   │   │   ├── home/
│   │   │   ├── dataentry/
│   │   │   ├── calendar/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── viewmodel/
│   │   └── theme/
│   ├── utils/
│   ├── worker/
│   └── MainActivity.kt
├── src/main/res/
│   ├── layout/
│   ├── values/
│   └── drawable/
└── build.gradle.kts
```

## Data Model

### Transaction Entity
```kotlin
@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String,
    val date: LocalDate,
    val cashCollectCount: Int,
    val senderPayCount: Int,
    val rejectedFocCount: Int,
    val ecCount: Int,
    val dailyTotal: Int,
    val createdAt: Instant,
    val updatedAt: Instant
)
```

### Settings Entity
```kotlin
@Entity(tableName = "settings")
data class Settings(
    @PrimaryKey val key: String,
    val value: String,
    val updatedAt: Instant
)
```

## Business Logic

### Daily Calculations
- Cash Collect: `count × 200 MMK`
- Sender Pay: `count × 100 MMK`
- Rejected/FOC: `count × 0 MMK`
- EC: `count × 0 MMK` (daily, calculated monthly)

### Monthly Calculations
- Standard Earnings: Sum of all daily totals
- EC Bonus: `Total EC Count × 600 MMK`
- Monthly Total: `Standard Earnings + EC Bonus`

## Security & Privacy

### Data Protection
- Local storage only (no cloud sync)
- Encrypted backup files
- User data privacy compliance
- No personal information collection

### Permissions Required
- **Storage**: For backup/restore functionality
- **Bluetooth**: For printing functionality
- **Notifications**: For daily reminders

## Performance Requirements

### Target Specifications
- **Minimum Android Version**: API 24 (Android 7.0)
- **Target Android Version**: API 34 (Android 14)
- **Memory Usage**: < 50MB
- **Storage**: < 20MB app size
- **Performance**: Smooth UI with < 100ms response time

## Testing Strategy

### Unit Tests
- Repository layer testing
- ViewModel testing
- Use case testing
- Utility function testing

### Integration Tests
- Database operations
- PDF generation
- Bluetooth printing
- Backup/restore functionality

### UI Tests
- Screen navigation
- Data entry flow
- Report generation
- Settings functionality

## Deployment

### Build Configuration
- **Build Type**: Release (ProGuard enabled)
- **Signing**: Release keystore
- **Version Code**: 1
- **Version Name**: 1.0.0

### Distribution
- **Primary**: Direct APK distribution
- **Alternative**: Google Play Store (optional)
- **Updates**: In-app update checking

## Future Enhancements

### Version 1.1 Features
- Cloud sync option
- Multiple user support
- Advanced reporting with charts
- Export to Excel format

### Version 1.2 Features
- Multi-language support
- Dark mode theme
- Widget support
- Voice data entry

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Prepared By**: Development Team  
**Status**: Ready for Development
