/**
 * useNotifications Hook
 * 
 * Manages push notification permissions, tokens,
 * and local notification scheduling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { useSettingsStore } from '../store/settingsSlice';

interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface UseNotificationsReturn {
  expoPushToken: string | null;
  permission: Notifications.PermissionStatus | null;
  notification: Notifications.Notification | null;
  requestPermission: () => Promise<boolean>;
  scheduleNotification: (content: NotificationContent, trigger?: Notifications.NotificationTriggerInput) => Promise<string>;
  cancelNotification: (id: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  setBadgeCount: (count: number) => Promise<void>;
  getBadgeCount: () => Promise<number>;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications(): UseNotificationsReturn {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<Notifications.PermissionStatus | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  
  const { pushNotifications: notificationsEnabled } = useSettingsStore();
  
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Register for push notifications
  const registerForPushNotifications = useCallback(async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermission(finalStatus);

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      setExpoPushToken(token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const token = await registerForPushNotifications();
    return token !== null;
  }, [registerForPushNotifications]);

  // Schedule a local notification
  const scheduleNotification = useCallback(async (
    content: NotificationContent,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        data: content.data || {},
        sound: true,
      },
      trigger: trigger || null, // null for immediate
    });

    return id;
  }, []);

  // Cancel a notification
  const cancelNotification = useCallback(async (id: string): Promise<void> => {
    await Notifications.cancelScheduledNotificationAsync(id);
  }, []);

  // Cancel all notifications
  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  // Set badge count
  const setBadgeCount = useCallback(async (count: number): Promise<void> => {
    await Notifications.setBadgeCountAsync(count);
  }, []);

  // Get badge count
  const getBadgeCount = useCallback(async (): Promise<number> => {
    return await Notifications.getBadgeCountAsync();
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotifications();
    }

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Listen for notification responses (user taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { notification } = response;
        // Handle notification tap - navigate to relevant screen
        console.log('Notification tapped:', notification.request.content.data);
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [notificationsEnabled, registerForPushNotifications]);

  // Handle app state changes for badge updates
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Clear badge when app becomes active
        await setBadgeCount(0);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [setBadgeCount]);

  return {
    expoPushToken,
    permission,
    notification,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    setBadgeCount,
    getBadgeCount,
  };
}

export default useNotifications;
