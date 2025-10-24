# SmartFit: AI - React Native Expo App

A React Native mobile application for AI-powered style recommendations, converted from the original React web application. This app analyzes body type and face shape to provide personalized fashion and hairstyle recommendations.

## Features

- **AI-Powered Analysis**: Upload photos for body type and face shape analysis
- **Personalized Recommendations**: Get custom clothing and hairstyle suggestions
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Cross-Platform**: Works on both iOS and Android via Expo Go
- **Backend Ready**: Structured for easy backend integration

## Screens

- **Landing Screen**: Welcome screen with app overview and features
- **Upload Screen**: Photo upload interface for body and face images
- **Results Screen**: Display personalized recommendations
- **About Screen**: Information about the app and technology
- **Contact Screen**: Contact form and support information

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Image Picker** for photo selection
- **Expo Vector Icons** for icons
- **Context API** for state management

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SmartFitAI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app on your mobile device

## Project Structure

```
src/
├── components/          # Reusable components (if needed)
├── context/            # React Context for state management
│   └── AppContext.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/           # Screen components
│   ├── LandingScreen.tsx
│   ├── UploadScreen.tsx
│   ├── ResultScreen.tsx
│   ├── AboutScreen.tsx
│   └── ContactScreen.tsx
└── services/          # API services and utilities
    └── api.ts
```

## Backend Integration

The app is structured to easily integrate with a backend API. The `src/services/api.ts` file contains:

- Image upload functionality
- Analysis request/response handling
- History management
- Error handling

To connect to your backend:

1. Set the `EXPO_PUBLIC_API_URL` environment variable
2. Update the API endpoints in `src/services/api.ts`
3. Implement the corresponding backend endpoints

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (requires macOS)
- `npm run web` - Run in web browser
- `npm run build` - Build the app for production

## Features Implemented

✅ **Navigation**: Bottom tab navigation with stack navigation
✅ **Image Picker**: Photo selection for body and face images
✅ **UI Components**: Modern, responsive design matching original
✅ **State Management**: Context API for app state
✅ **TypeScript**: Full type safety throughout the app
✅ **Backend Ready**: API service structure for easy integration

## Future Enhancements

- [ ] Real AI integration for image analysis
- [ ] User authentication and profiles
- [ ] Analysis history and favorites
- [ ] Push notifications
- [ ] Offline support
- [ ] Social sharing features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@smartfit-ai.com or create an issue in the repository.


