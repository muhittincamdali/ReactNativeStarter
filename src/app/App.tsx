/**
 * Main Application Entry Point
 * 
 * This file serves as the root component for the React Native application.
 * It initializes all providers, handles app lifecycle events, and sets up
 * the navigation structure.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  AppState,
  AppStateStatus,
  Platform,
  LogBox,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { QueryClientProvider } from '@tanstack/react-query';

import { RootNavigator } from './RootNavigator';
import { AppProviders } from './providers';
import { useAuthStore } from '../store/authSlice';
import { useSettingsStore } from '../store/settingsSlice';
import { queryClient } from '../services/api/ApiClient';
import { initializeNotifications } from '../services/notifications/PushNotifications';
import { lightTheme, darkTheme } from '../theme/colors';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
  ]);
}

// Custom fonts to load
const customFonts = {
  'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
};

interface AppReadyState {
  fontsLoaded: boolean;
  authInitialized: boolean;
  notificationsInitialized: boolean;
}

export default function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const { theme: themePreference } = useSettingsStore();
  const { initialize: initializeAuth, isInitialized: authInitialized } = useAuthStore();
  
  const [appReady, setAppReady] = useState<AppReadyState>({
    fontsLoaded: false,
    authInitialized: false,
    notificationsInitialized: false,
  });

  // Determine active theme based on preference and system setting
  const activeTheme = useMemo(() => {
    if (themePreference === 'system') {
      return colorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themePreference === 'dark' ? darkTheme : lightTheme;
  }, [themePreference, colorScheme]);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(customFonts);
        setAppReady(prev => ({ ...prev, fontsLoaded: true }));
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Continue without custom fonts
        setAppReady(prev => ({ ...prev, fontsLoaded: true }));
      }
    }
    loadFonts();
  }, []);

  // Initialize authentication
  useEffect(() => {
    async function initAuth() {
      try {
        await initializeAuth();
        setAppReady(prev => ({ ...prev, authInitialized: true }));
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAppReady(prev => ({ ...prev, authInitialized: true }));
      }
    }
    initAuth();
  }, [initializeAuth]);

  // Initialize notifications
  useEffect(() => {
    async function initNotifications() {
      try {
        await initializeNotifications();
        setAppReady(prev => ({ ...prev, notificationsInitialized: true }));
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setAppReady(prev => ({ ...prev, notificationsInitialized: true }));
      }
    }
    initNotifications();
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground
      queryClient.resumePausedMutations();
    } else if (nextAppState === 'background') {
      // App went to background
      // Perform any cleanup or state persistence here
    }
  }, []);

  // Hide splash screen when ready
  const onLayoutRootView = useCallback(async () => {
    const isReady = Object.values(appReady).every(Boolean);
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Don't render until ready
  const isReady = Object.values(appReady).every(Boolean);
  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppProviders theme={activeTheme}>
            <View style={styles.container} onLayout={onLayoutRootView}>
              <StatusBar
                barStyle={activeTheme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={activeTheme.colors.background}
                translucent={Platform.OS === 'android'}
              />
              <RootNavigator />
            </View>
          </AppProviders>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
