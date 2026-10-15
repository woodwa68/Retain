import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import {
  getProcessTextWord,
  clearProcessTextIntent,
  getNotificationPayload,
  clearNotificationPayload,
} from '../../modules/process-text';
import { useStore } from '../store/store';

import * as Notifications from 'expo-notifications';

export function useProcessText(
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
  isReady: boolean,
) {
  const [notifWord, setNotifWord] = useState<string | null>(null);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotifWord(response.notification.request.content.title);
    });
    return () => subscription.remove();
  }, []);

  const setIntentWord = useStore((state) => state.setIntentWord);
  useEffect(() => {
    if (!isReady) return;
    async function handleProcessText() {
      const word = notifWord || (await getProcessTextWord()) || (await getNotificationPayload());

      if (!word || !navigationRef.current || word.includes('\u200B')) return;
      setIntentWord(word);
      await clearProcessTextIntent();
      await clearNotificationPayload();
      setNotifWord(null);
      navigationRef.current.navigate('HomeTabs', {
        screen: 'Home',
      });
    }
    handleProcessText();

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') handleProcessText();
    });

    return () => subscription.remove();
  }, [isReady, navigationRef, notifWord, setIntentWord]);
}
