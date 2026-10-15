import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createZustandStorage, dictSettingsStorage } from './mmkv';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

interface NotificationRecord {
  descriptor: string;
  id: number;
}
export interface SettingsState {
  voices: Speech.Voice[];
  darkOrLightMode: boolean;
  seletectedVoice: string;
  isVoicesLoaded: boolean;
  loadVoices: () => Promise<void>;
  toggleTheme: () => void;
  resetSettings: () => void;
  setVoice: (voice: string) => void;
  notificationTime: Date;
  setNotificationTime: (date: Date) => void;
  shouldRevealDefinition: boolean;
  setShouldRevealDefinition: (value: boolean) => void;
  pushEnabled: boolean;
  setPushEnabled: () => void;
  dailyNotifications: boolean;
  setDailyNotiifications: () => void;
  weeklyNotifications: boolean;
  setWeeklyNotiifications: () => void;
  maxEntries: number;
  setMaxEntries: (value: number) => void;
  notificationEntries: NotificationRecord[];
  removeNotificationEntries: (type: string) => void;
  addNotificationEntry: (key: string, value: number) => void;
}
const time = new Date();
time.setHours(8, 15);
const DEFAULT_STATE = {
  voices: [] as Speech.Voice[],
  isVoicesLoaded: false,
  darkOrLightMode: false,
  notificationTime: time,
  shouldRevealDefinition: true,
  pushEnabled: false,
  dailyNotifications: true,
  weeklyNotifications: true,
  maxEntries: 3,
  notificationEntries: [],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      removeNotificationEntries: (type: string) =>
        set((state) => ({
          notificationEntries: state.notificationEntries.filter(
            (entry) => !entry.descriptor.includes('-' + type),
          ),
        })),

      addNotificationEntry: (key: string, value: number) =>
        set((state) => ({
          notificationEntries: [...state.notificationEntries, { descriptor: key, id: value }],
        })),
      setMaxEntries: (value: number) => set((state) => ({ maxEntries: value })),
      setWeeklyNotiifications: () =>
        set((state) => ({ weeklyNotifications: !state.weeklyNotifications })),
      setDailyNotiifications: () =>
        set((state) => ({ dailyNotifications: !state.dailyNotifications })),
      setPushEnabled: () => set((state) => ({ pushEnabled: !state.pushEnabled })),
      seletectedVoice:
        Platform.OS === 'ios' ? 'com.apple.voice.super-compact.en-US.Samantha' : 'en-US-language',
      setShouldRevealDefinition: (value: boolean) =>
        set((state) => {
          return { shouldRevealDefinition: value };
        }),
      setNotificationTime: (date: Date) =>
        set(() => {
          return { notificationTime: date };
        }),
      loadVoices: async () => {
        const allVoices = await Speech.getAvailableVoicesAsync();
        const enVoices = allVoices.filter((v) => v.language === 'en-US');
        set({ voices: enVoices, isVoicesLoaded: true });
      },
      setVoice: (voice: string) =>
        set(() => {
          return { seletectedVoice: voice };
        }),
      toggleTheme: () =>
        set((state) => {
          return {
            darkOrLightMode: !state.darkOrLightMode,
          };
        }),
      resetSettings: () => set(DEFAULT_STATE),
    }),
    {
      name: 'dict-settings',
      storage: createJSONStorage(() => createZustandStorage(dictSettingsStorage), {
        reviver: (key, value) => {
          if (key === 'notificationTime' && typeof value === 'string') {
            return new Date(value);
          }
          return value;
        },
        replacer: (key, value) => value, // default behavior is fine for stringify
      }),
    },
  ),
);
