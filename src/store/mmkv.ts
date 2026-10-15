import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware/persist';

export const wordHistoryStorage = createMMKV({ id: 'word-history' });
export const dictSettingsStorage = createMMKV({ id: 'dict-settings' });

// Factory: pass in the MMKV instance, get back a StateStorage
export const createZustandStorage = (mmkv: ReturnType<typeof createMMKV>): StateStorage => ({
  setItem: (name, value) => mmkv.set(name, value),
  getItem: (name) => mmkv.getString(name) ?? null,
  removeItem: (name) => mmkv.remove(name),
});
