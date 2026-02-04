<p align="center">
  <img src="assets/logo.png" alt="ReactNativeStarter" width="200"/>
</p>

<h1 align="center">ReactNativeStarter</h1>

<p align="center">
  <strong>⚡ Enterprise-grade React Native boilerplate with Expo Router, Zustand & React Query</strong>
</p>

<p align="center">
  <a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml">
    <img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="CI"/>
  </a>
  <img src="https://img.shields.io/badge/React_Native-0.75-blue.svg" alt="React Native 0.75"/>
  <img src="https://img.shields.io/badge/Expo-52-blue.svg" alt="Expo 52"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
</p>

---

## Why ReactNativeStarter?

Starting a React Native project with best practices takes days. **ReactNativeStarter** provides a production-ready foundation with modern tools pre-configured.

## What's Included

| Feature | Implementation |
|---------|---------------|
| 📱 **Framework** | Expo 52 + Dev Client |
| 🧭 **Routing** | Expo Router v3 |
| 🔄 **State** | Zustand |
| 🌐 **Data** | React Query (TanStack) |
| 📝 **Forms** | React Hook Form + Zod |
| 🎨 **Styling** | NativeWind (Tailwind) |
| 🔐 **Auth** | Expo SecureStore |
| 🧪 **Testing** | Jest + React Native Testing Library |
| 📦 **TypeScript** | Strict mode |
| 🚀 **CI/CD** | EAS Build + GitHub Actions |

## Quick Start

```bash
# Clone and setup
npx create-expo-app my-app --template react-native-starter

# Or clone directly
git clone https://github.com/muhittincamdali/ReactNativeStarter.git
cd ReactNativeStarter
npm install
npm start
```

## Project Structure

```
src/
├── app/                 # Expo Router pages
│   ├── (auth)/
│   ├── (tabs)/
│   └── _layout.tsx
├── components/          # Reusable components
├── hooks/              # Custom hooks
├── services/           # API services
├── stores/             # Zustand stores
├── utils/              # Utilities
└── types/              # TypeScript types
```

## State Management

```typescript
// stores/auth.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await authApi.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));
```

## Data Fetching

```typescript
// React Query
const { data, isLoading } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => userApi.getUser(userId),
});

// Mutations
const mutation = useMutation({
  mutationFn: userApi.updateUser,
  onSuccess: () => queryClient.invalidateQueries(['users']),
});
```

## Styling (NativeWind)

```tsx
<View className="flex-1 bg-white dark:bg-black">
  <Text className="text-xl font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
  <Pressable className="bg-blue-500 px-4 py-2 rounded-lg active:bg-blue-600">
    <Text className="text-white">Press Me</Text>
  </Pressable>
</View>
```

## Navigation

```tsx
// app/(tabs)/_layout.tsx
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

// Navigate
router.push('/profile');
router.replace('/auth/login');
```

## Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_ANALYTICS_KEY=xxx
```

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## Testing

```typescript
// __tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/components/Button';

test('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress}>Press</Button>);
  
  fireEvent.press(getByText('Press'));
  
  expect(onPress).toHaveBeenCalled();
});
```

## Build & Deploy

```bash
# Development
npm start

# Build for stores
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm test` | Run tests |
| `npm run lint` | Lint code |
| `npm run type-check` | TypeScript check |
| `npm run build:ios` | Build iOS |
| `npm run build:android` | Build Android |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License

---

## 📈 Star History

<a href="https://star-history.com/#muhittincamdali/ReactNativeStarter&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=muhittincamdali/ReactNativeStarter&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=muhittincamdali/ReactNativeStarter&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=muhittincamdali/ReactNativeStarter&type=Date" />
 </picture>
</a>
