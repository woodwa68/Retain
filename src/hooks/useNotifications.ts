import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { useSettingsStore } from '../store/settingStore';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const { pushEnabled, setPushEnabled } = useSettingsStore((state) => state);
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);

  const [notification, setNotification] = useState<Notifications.Notification>();

  const registerForPushNotifications = useCallback(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token && typeof token === 'string') {
        setExpoPushToken(token);
        setPushEnabled();
      }
    });
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
    }

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      if (notification.request.content.data) {
        const { word, definition, notifId } = notification.request.content.data;
        //showWordNotification(word, definition, notifId);
      } else return setNotification;
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {},
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [setPushEnabled]);

  return {
    expoPushToken,
    channels,
    notification,
    registerForPushNotifications,
  };
}
