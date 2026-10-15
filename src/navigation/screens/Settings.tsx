import { Text } from '@react-navigation/elements';
import { Button, View, Platform } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import {
  cancelNotifications,
  getSampleWordHistory,
  NotificationModule,
  scheduleNotifications,
} from '../../utils/notifications';
import { useSettingsStore } from '../../store/settingStore';
import { Dropdown } from 'react-native-element-dropdown';

import { useTheme } from '../../utils/theme';
import { usePronunciation } from '../../hooks/usePronounciation';
import TimePicker from '../../components/TimePicker';
import { useStore } from '../../store/store';
import Toggle from '../../components/Toggle';
import Brand from '../../components/Brand';
import { Voice } from 'expo-speech';
import HelpTooltip from '../../components/HelpTooltip';
import { useEffect, useState } from 'react';

export function Settings() {
  const { expoPushToken, registerForPushNotifications } = useNotifications();
  const [options, setOptions] = useState<
    {
      text: string;
    }[]
  >([]);

  const { history } = useStore((state) => state);
  const getVoices = useSettingsStore((state) => state.voices);
  const settings = useSettingsStore((state) => state);
  const { play } = usePronunciation('this is a test');

  const selectedVoice = useSettingsStore((state) => state.seletectedVoice);

  const theme = useTheme();
  const sampleHistory = getSampleWordHistory();
  const sampleHistoryLength = sampleHistory.length;

  useEffect(() => {
    const getOptions = async () => {
      const canSchedule = NotificationModule && (await NotificationModule.canScheduleExactAlarms());

      return canSchedule
        ? [{ text: 'Unveil defintion' }, { text: 'Display defintion in notification' }]
        : [{ text: 'Display defintion in notification' }];
    };

    getOptions().then((a) => setOptions(a));
  }, []);

  const renderItem = (item: Voice) => {
    let text = '';
    if (item.identifier) text = item.identifier;
    // @ts-ignore
    if (item.text) text = item.text;
    return (
      <View style={theme} className="p-3">
        <Text style={[theme, selectedVoice === text ? { color: 'red' } : {}]}>
          {text.split('.').pop()}
        </Text>
      </View>
    );
  };

  if (!options) return null;

  return (
    <View className={`w-full flex h-full flex-col gap-4 pt-3 pl-3 pr-3`}>
      <View className="flex-row  items-center">
        <View className="flex-1">
          <Text>Toggle Dark Mode</Text>
        </View>
        <View className="flex-1">
          <View className="flex  items-center justify-center">
            <View className="flex flex-col items-center gap-4">
              <Toggle size={48} action={settings.toggleTheme} />
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row items-center">
        <View className="flex-1">
          <Text>Phoentics Voice</Text>
        </View>
        <View className="flex-1">
          <Dropdown
            mode="modal"
            placeholderStyle={theme}
            selectedTextStyle={theme}
            containerStyle={[theme, { position: 'absolute', left: 5 }]}
            data={getVoices}
            placeholder={getVoices.find((v) => v.identifier === selectedVoice)?.name ?? 'None'}
            labelField={'name'}
            valueField={'identifier'}
            renderItem={renderItem}
            onChange={(v: Voice) => {
              settings.setVoice(v.identifier);
              play(v.identifier);
            }}
          />
        </View>
      </View>
      <View className="flex-row items-center">
        <View className="flex-1 pr-5">
          <Text>Enable Notifications</Text>
        </View>

        <View className="flex-1">
          <View className="flex  items-center justify-center">
            <View className="flex flex-col items-center gap-4">
              <Toggle
                size={36}
                setting={'pushEnabled'}
                action={async () => {
                  if (!expoPushToken) {
                    await registerForPushNotifications();

                    return () => {};
                  } else {
                    if (settings.pushEnabled)
                      await Notifications.cancelAllScheduledNotificationsAsync();
                    return settings.setPushEnabled();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
      {settings.pushEnabled && (
        <>
          <View className="flex-row items-center">
            <View className="flex-1 flex-row justify-between items-center pr-5">
              <Text>Daily Notifications</Text>
              <HelpTooltip
                text={`Enabling this will trigger one notification the following day for each word you looked up the previous day. The time of notification is determined by "Notification Time" setting.\n\nDisabling this will cancel any pending daily notifications and cannot be undone.`}
              />
            </View>
            <View className="flex-1">
              <View className="flex  items-center justify-center">
                <Toggle
                  size={36}
                  setting={'dailyNotifications'}
                  action={async () => {
                    if (settings.dailyNotifications) {
                      cancelNotifications(true, history);

                      await Promise.all(
                        settings.notificationEntries
                          .filter((entry) => entry.descriptor.includes('-daily'))
                          .map((entry) =>
                            Platform.OS === 'android' && NotificationModule
                              ? NotificationModule.cancelWordNotification(entry.id)
                              : Promise.resolve(),
                          ),
                      );

                      settings.removeNotificationEntries('daily');
                    }
                    settings.setDailyNotiifications();
                  }}
                />
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="flex-1 flex-row justify-between items-center pr-5">
              <Text>Weekly Notifications</Text>
              <HelpTooltip
                text={`Enabling this will trigger one notification one week from the day you looked up a word. The time of notification is determined by "Notification Time" setting.\n\nDisabling this will cancel any pending weekly notifications and cannot be undone.`}
              />
            </View>
            <View className="flex-1">
              <View className="flex flex-col items-center">
                <Toggle
                  size={36}
                  setting={'weeklyNotifications'}
                  action={async () => {
                    if (settings.weeklyNotifications) {
                      cancelNotifications(false, history);

                      await Promise.all(
                        settings.notificationEntries
                          .filter((entry) => entry.descriptor.includes('weekly'))
                          .map((entry) =>
                            Platform.OS === 'android' && NotificationModule
                              ? NotificationModule.cancelWordNotification(entry.id)
                              : Promise.resolve(),
                          ),
                      );

                      settings.removeNotificationEntries('weekly');
                    }
                    settings.setWeeklyNotiifications();
                  }}
                />
              </View>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="flex-1 flex-row justify-between items-center">
              <Text>Notification Time</Text>
            </View>
            <View className="flex-1">
              <TimePicker />
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="flex-1 flex-row justify-between items-center pr-5">
              <Text>Notification Style</Text>
              <HelpTooltip
                text={`"Unveil Deifinition" will hide the definition and give you the option to reveal the definition with a dropdown.
                                  \n"Display defintion in notification" will allow you to see the definition immmediately within the body of the notification.`}
              />
            </View>
            <View className="flex-1">
              <Dropdown
                mode="modal"
                placeholderStyle={theme}
                selectedTextStyle={theme}
                containerStyle={[theme, { position: 'absolute', left: 5 }]}
                data={options}
                placeholder={
                  !settings.shouldRevealDefinition
                    ? 'Unveil defintion'
                    : 'Display defintion in notification'
                }
                labelField={'text'}
                valueField={'text'}
                renderItem={renderItem}
                onChange={(v) => {
                  if (v.text === 'Unveil defintion') settings.setShouldRevealDefinition(false);
                  else settings.setShouldRevealDefinition(true);
                }}
              />
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="flex-1 flex-row justify-between items-center pr-5">
              <Text>Max Entries in Notification</Text>
            </View>
            <View className="flex-1">
              <Dropdown
                mode="modal"
                placeholderStyle={theme}
                selectedTextStyle={theme}
                containerStyle={[theme, { position: 'absolute', left: 5 }]}
                data={[{ text: '1' }, { text: '2' }, { text: '3' }]}
                placeholder={settings.maxEntries.toString()}
                labelField={'text'}
                valueField={'text'}
                renderItem={renderItem}
                onChange={(v) => {
                  settings.setMaxEntries(parseInt(v.text, 10));
                }}
              />
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="flex-1 ">
              <Text>Test Notification</Text>
            </View>
            <View className="flex-1">
              <Button
                onPress={() => {
                  const randomIndex = Math.floor(sampleHistoryLength * Math.random());
                  const id = Date.now() + 5000;
                  scheduleNotifications(
                    new Date(id),
                    sampleHistory[randomIndex][0].word + '\u200B',
                    sampleHistory[randomIndex][0].meanings[0].definitions
                      .map((d, i) => {
                        if (i + 1 > settings.maxEntries) return null;
                        return i + 1 + '. ' + d.definition;
                      })
                      .filter((v) => v !== null)
                      .join('\n\n'),
                    settings.shouldRevealDefinition,
                    true,
                  );
                }}
                title="Trigger Notification"
                color={theme.colors.secondary}
              />
            </View>
          </View>
        </>
      )}
      <View className="absolute bottom-10 flex-row ph-[50%] items-center justify-center w-full">
        <Brand />
      </View>
    </View>
  );
}
