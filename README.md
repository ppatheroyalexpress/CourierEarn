# CourierEarn Android Application

CourierEarn is a mobile application designed for couriers to track their daily earnings and manage their delivery data efficiently.

## Project Overview

**Version**: v1.0 "Yam"  
**User**: PPA | 30 (Chanmyathazi East)  
**Platform**: Android  
**Architecture**: MVVM with Clean Architecture

## Features

### Core Functionality
- **Daily Data Entry**: Track different types of transactions (Cash Collect, Sender Pay, Rejected/FOC, EC)
- **Monthly Calculations**: Automatic calculation of earnings with EC bonuses
- **Calendar View**: Visual representation of daily earnings
- **Reports Generation**: PDF and Bluetooth printing capabilities
- **Data Backup**: JSON backup and restore functionality
- **Daily Reminders**: 8 PM notifications for data entry

### Technical Specifications
- **UI**: Material Design 3
- **Database**: Room (SQLite)
- **Background Tasks**: WorkManager
- **Export**: PDF generation and ESC/POS printing
- **Architecture**: Clean Architecture with MVVM

## Project Structure

```
CourierEarn/
├── specs/
│   └── CourierEarn-v1.0.md    # Detailed specification document
├── app/                        # Android application module
├── build.gradle               # Project build configuration
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Android Studio Arctic Fox or later
- Android SDK API 24+ (Android 7.0)
- Kotlin 1.8+
- Git

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ppatheroyalexpress/CourierEarn.git
   ```

2. Open the project in Android Studio

3. Sync the project with Gradle files

4. Build and run the application

## Development

### Technology Stack
- **Language**: Kotlin
- **UI Framework**: Material Design 3
- **Architecture**: MVVM + Clean Architecture
- **Database**: Room
- **Dependency Injection**: Hilt
- **Background Processing**: WorkManager
- **PDF Generation**: iText7
- **Bluetooth Printing**: ESC/POS

### Key Libraries
- Material Design Components
- Navigation Component
- Room Database
- WorkManager
- Hilt (Dependency Injection)
- iText7 (PDF)
- ESC/POS (Thermal Printing)

## Documentation

For detailed specifications, please refer to:
- [CourierEarn v1.0 Specification](specs/CourierEarn-v1.0.md)

## Contributing

This project is maintained by the PPA development team. Please follow the established coding standards and commit message conventions.

## License

This project is proprietary and belongs to PPA | 30 (Chanmyathazi East).

## Contact

For any questions or support regarding this application, please contact the PPA development team.

---

**Project Status**: In Development  
**Last Updated**: February 2026
