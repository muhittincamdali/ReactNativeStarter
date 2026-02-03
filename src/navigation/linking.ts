/**
 * Deep Linking Configuration
 * 
 * Defines the deep linking structure for the application.
 * Supports universal links and custom URL schemes.
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from './types';

// URL scheme prefix
const prefix = Linking.createURL('/');

// Universal link prefixes
const UNIVERSAL_LINK_PREFIXES = [
  'https://app.example.com',
  'https://example.com',
];

/**
 * Linking configuration
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, ...UNIVERSAL_LINK_PREFIXES],

  config: {
    initialRouteName: 'Main',
    screens: {
      // Auth Stack
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: {
            path: 'reset-password/:token',
            parse: {
              token: (token: string) => token,
            },
          },
          VerifyEmail: {
            path: 'verify-email',
            parse: {
              email: (email: string) => decodeURIComponent(email),
            },
          },
        },
      },

      // Main Tab Navigator
      Main: {
        screens: {
          // Home Stack
          Home: {
            screens: {
              HomeMain: '',
              Details: {
                path: 'details/:id',
                parse: {
                  id: (id: string) => id,
                  title: (title: string) => title,
                },
              },
              Search: 'search',
            },
          },

          // Explore
          Explore: 'explore',

          // Notifications
          Notifications: 'notifications',

          // Profile Stack
          Profile: {
            screens: {
              ProfileMain: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
              ChangePassword: 'settings/password',
              TwoFactorAuth: 'settings/2fa',
            },
          },
        },
      },
    },
  },

  /**
   * Handle incoming URL
   */
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url !== null) {
      return url;
    }

    // Handle notifications that contain a link
    // const response = await Notifications.getLastNotificationResponseAsync();
    // return response?.notification.request.content.data?.url;

    return null;
  },

  /**
   * Subscribe to URL changes
   */
  subscribe(listener) {
    // Listen for incoming links
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    // Listen for notification links
    // const notificationSubscription = Notifications.addNotificationResponseReceivedListener(
    //   (response) => {
    //     const url = response.notification.request.content.data?.url;
    //     if (url) {
    //       listener(url);
    //     }
    //   }
    // );

    return () => {
      linkingSubscription.remove();
      // notificationSubscription.remove();
    };
  },
};

/**
 * Generate deep link URL
 */
export function generateDeepLink(path: string): string {
  return Linking.createURL(path);
}

/**
 * Parse deep link URL
 */
export function parseDeepLink(url: string): { path: string; params: Record<string, string> } {
  const { path, queryParams } = Linking.parse(url);
  
  return {
    path: path || '',
    params: queryParams as Record<string, string>,
  };
}

export default linking;
