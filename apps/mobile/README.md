# TheraBrake Academy - Mobile App

React Native mobile application built with Expo for TheraBrake Academy learning platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the App

#### Start Expo Development Server
```bash
npm start
```

#### Run on iOS (Mac only)
```bash
npm run ios
```

#### Run on Android
```bash
npm run android
```

#### Run on Web
```bash
npm run web
```

## 📱 Features

- **Authentication**: Sign in, sign up, password reset with Supabase
- **Course Catalog**: Browse and search available courses
- **Video Player**: Watch course lessons with Expo Video
- **Progress Tracking**: Track learning progress and completion
- **Certificates**: View and download earned certificates
- **Offline Support**: Continue learning with cached content

## 🏗️ Architecture

### Shared Packages
The mobile app uses shared packages from the monorepo:

- `@therabrake/shared-types` - TypeScript types shared with web app
- `@therabrake/api-client` - Supabase API wrapper
- `@therabrake/config` - Configuration constants

### Project Structure
```
mobile/
├── app/              # Expo Router screens
│   ├── (tabs)/      # Tab navigation screens
│   └── _layout.tsx  # Root layout with providers
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth, etc.)
├── lib/             # Utility libraries
│   └── supabase.ts  # Supabase client configuration
├── constants/       # App constants
└── assets/          # Images, fonts, etc.
```

## 🔐 Authentication

The app uses Supabase authentication with secure token storage via Expo SecureStore:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  // Use authentication methods
}
```

## 🎨 UI Components

Built with React Native components and Expo libraries for a native experience.

## 📚 API Integration

The app shares the same Supabase backend as the web application:

```tsx
import { supabase } from '@/lib/supabase';

// Make authenticated requests
const { data, error } = await supabase
  .from('courses')
  .select('*');
```

## 🧪 Testing

```bash
npm test
```

## 📦 Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## 🔧 Troubleshooting

### Clear Cache
```bash
npm run reset
```

### Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

## 📖 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
