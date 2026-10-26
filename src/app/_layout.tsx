import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

import { api } from '@/lib/api';
import { queryClient } from '@/lib/query-client';
import { restoreSession, useSession } from '@/lib/session';
import { palettes, useTheme } from '@/theme';

// Keep the splash screen up until the saved session has been read, so a signed-in user never
// sees the sign-in screen flash by.
void SplashScreen.preventAutoHideAsync();

// React Native reports this when a native-driven animation sends a value after its screen has
// gone (switching tabs). It has no effect on the app, and in development its toast would cover the
// tab bar.
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

function navigationTheme(scheme: 'light' | 'dark'): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = palettes[scheme];
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };
}

export default function RootLayout() {
  const status = useSession((state) => state.status);
  const { scheme } = useTheme();

  useEffect(() => {
    void restoreSession(() => api.me());
  }, []);

  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync();
  }, [status]);

  if (status === 'loading') return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme(scheme)}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Protected guard={status === 'signed-in'}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
          <Stack.Protected guard={status === 'signed-out'}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
