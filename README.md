# React Native Starter

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Enterprise-grade React Native boilerplate with Expo Router, Zustand, React Query, and Reanimated**

[Getting Started](#-getting-started) •
[Features](#-features) •
[Architecture](#-architecture) •
[Documentation](#-documentation)

</div>

---

## 📱 Overview

React Native Starter is a production-ready boilerplate that provides everything you need to build scalable, maintainable mobile applications. It follows industry best practices and includes a comprehensive set of features commonly needed in modern apps.

### Why This Boilerplate?

- **Production Ready**: Battle-tested patterns used in real-world applications
- **Type Safe**: Full TypeScript support with strict type checking
- **Scalable Architecture**: MVVM pattern with clean separation of concerns
- **Modern Stack**: Latest versions of Expo, React Native, and ecosystem tools
- **Developer Experience**: Hot reload, debugging tools, and comprehensive documentation

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Complete auth flow with login, register, password reset, and social login |
| 📱 **Navigation** | Type-safe navigation with Expo Router and deep linking |
| 🎨 **Theming** | Light/dark mode with system preference detection |
| 📦 **State Management** | Zustand stores with persistence and devtools |
| 🌐 **API Client** | Axios-based client with interceptors and retry logic |
| 🔔 **Push Notifications** | Expo Notifications with local scheduling |
| 💾 **Storage** | AsyncStorage and SecureStorage wrappers |
| 🎭 **Animations** | React Native Reanimated for smooth 60fps animations |

### UI Components

- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Text input with validation, icons, and error states
- **Card**: Flexible card component with elevation and variants
- **Avatar**: User avatars with fallback initials
- **Loading**: Customizable loading indicators
- **Header**: Navigation header with actions
- **TabBar**: Custom bottom tab bar with badges

### Developer Tools

- Jest testing setup with React Native Testing Library
- ESLint and Prettier configuration
- Husky pre-commit hooks
- Path aliases for clean imports
- Environment variable support

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/muhittincamdali/ReactNativeStarter.git

# Navigate to project directory
cd ReactNativeStarter

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Devices

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web (experimental)
npm run web
```

### Environment Setup

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=https://api.yourapp.com
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

---

## 🏗 Architecture

### Project Structure

```
src/
├── app/                    # App entry and providers
│   ├── App.tsx            # Main app component
│   ├── RootNavigator.tsx  # Navigation structure
│   └── providers.tsx      # Context providers
│
├── screens/               # Screen components
│   ├── auth/             # Authentication screens
│   ├── home/             # Home and feed screens
│   ├── profile/          # User profile screens
│   └── settings/         # App settings screens
│
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useApi.ts         # API request hook
│   ├── useStorage.ts     # Storage hook
│   ├── useTheme.ts       # Theme hook
│   └── useNotifications.ts
│
├── services/              # External services
│   ├── api/              # API client and services
│   ├── storage/          # Storage services
│   └── notifications/    # Push notification service
│
├── store/                 # State management
│   ├── store.ts          # Store configuration
│   ├── authSlice.ts      # Auth state
│   ├── userSlice.ts      # User state
│   └── settingsSlice.ts  # Settings state
│
├── theme/                 # Theming
│   ├── colors.ts         # Color palette
│   ├── typography.ts     # Font styles
│   └── spacing.ts        # Spacing scale
│
├── navigation/            # Navigation config
│   ├── types.ts          # Navigation types
│   └── linking.ts        # Deep linking config
│
├── utils/                 # Utility functions
│   ├── validators.ts     # Form validation
│   ├── formatters.ts     # Data formatters
│   └── helpers.ts        # General helpers
│
└── types/                 # TypeScript types
    ├── api.ts            # API types
    └── models.ts         # Domain models
```

### Design Patterns

#### MVVM Architecture

Each screen follows the Model-View-ViewModel pattern:

```
screens/
└── home/
    ├── HomeScreen.tsx      # View
    ├── HomeViewModel.ts    # ViewModel
    └── components/         # Screen-specific components
```

#### State Management

Zustand stores with slices for different domains:

```typescript
// authSlice.ts
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setAuth: (data) => set({ ...data }),
        clearAuth: () => set({ user: null, isAuthenticated: false }),
      }),
      { name: 'auth-storage' }
    )
  )
);
```

---

## 📚 Documentation

### Authentication

The auth flow supports email/password and social login:

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
  };
}
```

### API Requests

Use the ApiClient for all HTTP requests:

```typescript
import { ApiClient } from '@/services/api/ApiClient';

// GET request
const users = await ApiClient.get<User[]>('/users');

// POST request
const newUser = await ApiClient.post<User>('/users', { name: 'John' });
```

### Theming

Access theme values with the useTheme hook:

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={typography.headlineLarge}>Hello</Text>
    </View>
  );
}
```

### Navigation

Type-safe navigation with TypeScript:

```typescript
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreenProps } from '@/navigation/types';

function MyScreen({ navigation }: HomeStackScreenProps<'HomeMain'>) {
  navigation.navigate('Details', { id: '123' });
}
```

### Form Validation

Built-in validators for common use cases:

```typescript
import { validateEmail, validatePassword, getPasswordStrength } from '@/utils/validators';

const emailResult = validateEmail('test@example.com');
// { isValid: true }

const strength = getPasswordStrength('MyP@ssw0rd');
// { score: 4, level: 'strong' }
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
__tests__/
├── components/
│   └── Button.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── utils/
    ├── validators.test.ts
    └── formatters.test.ts
```

---

## 📦 Dependencies

### Core

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~51.0.0 | Expo SDK |
| react-native | 0.74.x | React Native core |
| typescript | ~5.3.0 | TypeScript support |

### Navigation

| Package | Purpose |
|---------|---------|
| @react-navigation/native | Navigation framework |
| @react-navigation/native-stack | Stack navigator |
| @react-navigation/bottom-tabs | Tab navigator |

### State Management

| Package | Purpose |
|---------|---------|
| zustand | State management |
| @tanstack/react-query | Server state management |

### UI & Animation

| Package | Purpose |
|---------|---------|
| react-native-reanimated | Animations |
| react-native-gesture-handler | Gestures |
| react-native-safe-area-context | Safe area |
| @expo/vector-icons | Icons |

### Storage & Security

| Package | Purpose |
|---------|---------|
| @react-native-async-storage/async-storage | Async storage |
| expo-secure-store | Secure storage |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing development platform
- [React Native](https://reactnative.dev) community
- All open source contributors

---

<div align="center">

**Built with ❤️ by [Muhittin Camdali](https://github.com/muhittincamdali)**

⭐ Star this repository if you find it helpful!

</div>
