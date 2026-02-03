/**
 * Push Notifications Service
 * 
 * Handles push notification registration, handling,
 * and local notification scheduling.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

import { ApiClient } from '../api/ApiClient';

// Notification categories
export const NotificationCategories = {
  GENERAL: 'general',
  MESSAGE: 'message',
  ACTIVITY: 'activity',
  REMINDER: 'reminder',
  PROMOTION: 'promotion',
} as const;

// Notification channels (Android)
const NOTIFICATION_CHANNELS = [
  {
    id: 'default',
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6366F1',
  },
  {
    id: 'messages',
    name: 'Messages',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#10B981',
  },
  {
    id: 'reminders',
    name: 'Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
    lightColor: '#F59E0B',
  },
];

/**
 * Initialize push notifications
 */
export async function initializeNotifications(): Promise<void> {
  // Set up notification handler
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      // Determine how to handle notification based on category
      const category = notification.request.content.categoryIdentifier;
      
      return {
        shouldShowAlert: true,
        shouldPlaySound: category !== NotificationCategories.PROMOTION,
        shouldSetBadge: true,
      };
    },
  });

  // Create Android notification channels
  if (Platform.OS === 'android') {
    for (const channel of NOTIFICATION_CHANNELS) {
      await Notifications.setNotificationChannelAsync(channel.id, channel);
    }
  }
}

/**
 * Register for push notifications
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Check if running on physical device
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Get existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Notifications Disabled',
      'Enable notifications in Settings to receive updates.'
    );
    return null;
  }

  try {
    // Get Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    
    // Register token with backend
    await registerDeviceToken(tokenData.data);
    
    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Register device token with backend
 */
async function registerDeviceToken(token: string): Promise<void> {
  try {
    await ApiClient.post('/notifications/register', {
      token,
      platform: Platform.OS,
      deviceName: Device.deviceName || 'Unknown',
    });
  } catch (error) {
    console.error('Error registering device token:', error);
  }
}

/**
 * Unregister device token
 */
export async function unregisterDeviceToken(): Promise<void> {
  try {
    await ApiClient.post('/notifications/unregister');
  } catch (error) {
    console.error('Error unregistering device token:', error);
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  trigger?: Notifications.NotificationTriggerInput
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger: trigger || null,
  });

  return id;
}

/**
 * Schedule a notification for a specific time
 */
export async function scheduleNotificationAtTime(
  title: string,
  body: string,
  date: Date,
  data?: Record<string, any>
): Promise<string> {
  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date,
  };

  return scheduleLocalNotification(title, body, data, trigger);
}

/**
 * Schedule a daily notification
 */
export async function scheduleDailyNotification(
  title: string,
  body: string,
  hour: number,
  minute: number,
  data?: Record<string, any>
): Promise<string> {
  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  };

  return scheduleLocalNotification(title, body, data, trigger);
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Set badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Get badge count
 */
export async function getBadgeCount(): Promise<number> {
  return Notifications.getBadgeCountAsync();
}

/**
 * Clear badge count
 */
export async function clearBadge(): Promise<void> {
  await setBadgeCount(0);
}

export default {
  initializeNotifications,
  registerForPushNotifications,
  unregisterDeviceToken,
  scheduleLocalNotification,
  scheduleNotificationAtTime,
  scheduleDailyNotification,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  setBadgeCount,
  getBadgeCount,
  clearBadge,
  NotificationCategories,
};
