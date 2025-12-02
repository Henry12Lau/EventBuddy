# Event Buddy

A React Native mobile application for organizing and joining sports and social events. Connect with others, create events, and manage your schedule all in one place.

## Features

- **Event Management**: Create, browse, and join events with ease
- **Real-time Chat**: Communicate with event participants through built-in chat functionality
- **Smart Filtering**: View upcoming events with automatic filtering of past and cancelled events
- **User Profiles**: Manage your profile and track your event participation
- **Schedule View**: See all your joined events in one convenient calendar view
- **Admin Tools**: Database management and seeding tools for administrators
- **Dual Environment**: Separate development and production Firebase databases
- **Offline Support**: Local storage for user data and preferences

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: React Context API
- **UI Components**: Custom components with React Native
- **Storage**: AsyncStorage for local data persistence

## Key Functionality

- Browse and search events by title or location
- Create events with customizable details (sport/activity, date, time, location, max participants)
- Join or exit events with real-time participant tracking
- Event chat rooms for communication
- Event creator controls (cancel events, manage participants)
- Role-based admin access for database management
- Automatic event expiration handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/event-buddy.git
cd event-buddy
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration for both development and production environments

4. Run the app
```bash
npm start
```

### Building for Production

#### Android APK
```bash
npx expo prebuild --platform android --clean
cd android
./gradlew assembleRelease
```

The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`

## Environment Variables

Create a `.env` file with your Firebase configuration:

```
EXPO_PUBLIC_ENV=dev

# Development Firebase Config
EXPO_PUBLIC_FIREBASE_DEV_API_KEY=your_dev_api_key
EXPO_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN=your_dev_auth_domain
EXPO_PUBLIC_FIREBASE_DEV_PROJECT_ID=your_dev_project_id
EXPO_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET=your_dev_storage_bucket
EXPO_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID=your_dev_sender_id
EXPO_PUBLIC_FIREBASE_DEV_APP_ID=your_dev_app_id

# Production Firebase Config
EXPO_PUBLIC_FIREBASE_PROD_API_KEY=your_prod_api_key
EXPO_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN=your_prod_auth_domain
EXPO_PUBLIC_FIREBASE_PROD_PROJECT_ID=your_prod_project_id
EXPO_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET=your_prod_storage_bucket
EXPO_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID=your_prod_sender_id
EXPO_PUBLIC_FIREBASE_PROD_APP_ID=your_prod_app_id
```

## Project Structure

```
event-buddy/
├── src/
│   ├── components/      # Reusable UI components
│   ├── config/          # Configuration files (Firebase, admin)
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens/pages
│   ├── services/        # Business logic and API calls
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── assets/              # Images, fonts, and other static files
├── android/             # Native Android code
└── ios/                 # Native iOS code
```

## Admin Features

Event Buddy includes admin tools for database management:

- **Database Migration**: Initialize and manage Firestore collections
- **Seed Data**: Populate the database with sample events and users
- **Clear Data**: Selectively clear events, users, or messages
- **Environment Switching**: Toggle between development and production databases

Access admin features from the Profile screen (admin users only).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.
