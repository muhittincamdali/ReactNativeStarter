/**
 * Navigation Types
 * 
 * Type definitions for all navigation stacks and screens.
 * Provides type-safe navigation throughout the app.
 */

import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Root Stack (Auth vs Main)
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

/**
 * Auth Stack
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
};

/**
 * Main Tab Navigator
 */
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Explore: undefined;
  Notifications: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Home Stack
 */
export type HomeStackParamList = {
  HomeMain: undefined;
  Details: { id: string; title?: string };
  Search: undefined;
};

/**
 * Profile Stack
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  TwoFactorAuth: undefined;
};

/**
 * Screen Props Types
 */

// Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Auth Stack
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Main Tab
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Home Stack
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

// Profile Stack
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

/**
 * Global navigation type declaration
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default {
  RootStackParamList: {} as RootStackParamList,
  AuthStackParamList: {} as AuthStackParamList,
  MainTabParamList: {} as MainTabParamList,
  HomeStackParamList: {} as HomeStackParamList,
  ProfileStackParamList: {} as ProfileStackParamList,
};
