/**
 * Root Navigator
 * 
 * Handles the main navigation structure of the application including
 * authentication flow, main tab navigation, and modal screens.
 */

import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Platform, View, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useAuthStore } from '../store/authSlice';
import { useTheme } from '../hooks/useTheme';
import { linking } from '../navigation/linking';
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  ProfileStackParamList,
} from '../navigation/types';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

// Components
import { TabBar } from '../components/layout/TabBar';
import { Header } from '../components/layout/Header';
import { Loading } from '../components/ui/Loading';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Authentication Stack Navigator
 * Handles login, registration, and password recovery flows
 */
function AuthNavigator(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>
  );
}

/**
 * Home Stack Navigator
 * Contains home screen and related detail screens
 */
function HomeNavigator(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: 'Inter-SemiBold' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <HomeStack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Details',
        })}
      />
      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          animation: 'fade',
        }}
      />
    </HomeStack.Navigator>
  );
}

/**
 * Profile Stack Navigator
 * Contains profile and edit profile screens
 */
function ProfileNavigator(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: 'Inter-SemiBold' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </ProfileStack.Navigator>
  );
}

/**
 * Main Tab Navigator
 * Bottom tab navigation for authenticated users
 */
function MainNavigator(): React.JSX.Element {
  const { colors } = useTheme();

  const tabBarOptions = useMemo(() => ({
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: 8,
      paddingBottom: Platform.OS === 'ios' ? 24 : 8,
      height: Platform.OS === 'ios' ? 88 : 64,
    },
    tabBarLabelStyle: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      marginTop: 4,
    },
  }), [colors]);

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        ...tabBarOptions,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <MainTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <MainTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarAccessibilityLabel: 'Explore tab',
        }}
      />
      <MainTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarAccessibilityLabel: 'Notifications tab',
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </MainTab.Navigator>
  );
}

/**
 * Placeholder screens (to be implemented)
 */
function ForgotPasswordScreen(): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Forgot Password Screen
      </Text>
    </View>
  );
}

function DetailsScreen(): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Details Screen
      </Text>
    </View>
  );
}

function SearchScreen(): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Search Screen
      </Text>
    </View>
  );
}

function ExploreScreen(): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Explore Screen
      </Text>
    </View>
  );
}

function NotificationsScreen(): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
      <Text style={[styles.placeholderText, { color: colors.text }]}>
        Notifications Screen
      </Text>
    </View>
  );
}

/**
 * Root Navigator Component
 * Main entry point for navigation, handles auth state
 */
export function RootNavigator(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { colors, isDark } = useTheme();

  // Custom navigation theme
  const navigationTheme: Theme = useMemo(() => ({
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  }), [colors, isDark]);

  // Handle deep link state changes
  const onStateChange = useCallback((state: any) => {
    // Analytics tracking can be added here
    if (__DEV__) {
      console.log('Navigation state:', state);
    }
  }, []);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={[styles.loadingContainer, { backgroundColor: colors.background }]}
      >
        <Loading size="large" text="Loading..." />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
      linking={linking}
      onStateChange={onStateChange}
      fallback={<Loading size="large" />}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },
});
