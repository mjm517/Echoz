# Memoir

A React Native mobile application for personal journaling and memoir writing, built with Expo.

## Getting Started

To set up the project, follow these steps:

1. Ensure you have Node.js installed
2. Install Expo CLI globally:
   ```
   npm install -g expo-cli
   ```
3. Create a new Expo project:
   ```
   npx create-expo-app memoir
   ```
4. Navigate to the project directory:
   ```
   cd memoir
   ```
5. Install additional dependencies:
   ```
   npm install expo-router
   ```
6. Start the development server:
   ```
   npm run start
   ```

## Troubleshooting

If you encounter issues with expo-router, try the following:

1. Clear the Metro bundler cache:
   ```
   npx expo start --clear
   ```
2. Ensure all dependencies are up to date:
   ```
   npm install
   ```

## Running the App

- To run on a physical device, install the Expo Go app and scan the QR code displayed in the terminal.
- To run on an iOS simulator, press 'i' in the terminal (requires Xcode).
- To run on an Android emulator, press 'a' in the terminal (requires Android Studio).

## Development

This project uses Expo for easy cross-platform development. The main files and directories you'll be working with are:

- `app/` directory: Contains the main screens and components of your app
- `App
