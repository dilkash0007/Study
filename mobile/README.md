# StarryJourney Mobile App

A React Native mobile application for the StarryJourney educational gamification platform.

## Features

- Cross-platform mobile application (iOS and Android)
- Seamless sync with web version
- Offline study capabilities
- Push notifications for quests and study reminders
- Mobile-optimized UI for studying on the go

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository
2. Navigate to the mobile directory: `cd mobile`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm start` or `yarn start`
5. Follow the Expo CLI instructions to run on your device or emulator

## Development

This mobile app is built using:

- React Native
- Expo
- React Navigation
- Zustand for state management
- Axios for API requests
- React Native Vector Icons

## API Connection

The mobile app connects to the same backend API as the web version. By default, it connects to `http://localhost:5000`. For production, this should be changed to your production API URL.

## Customization

You can customize the app by editing:

- `App.tsx` - Main application structure
- `screens/` - Individual screen components
- `components/` - Reusable UI components
- `lib/stores/` - State management stores
- `assets/` - Images and other assets

## Building for Production

To create a production build:

1. For Android: `expo build:android`
2. For iOS: `expo build:ios`

Follow the Expo documentation for detailed instructions on publishing to app stores.
