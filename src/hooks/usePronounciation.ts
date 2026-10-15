import * as Speech from 'expo-speech';
import { useSettingsStore } from '../store/settingStore';

export function usePronunciation(word: string) {
  const selectedVoice = useSettingsStore((state) => state.seletectedVoice);
  const play = (voice?: string) => {
    const thingToSay = word;

    Speech.speak(thingToSay, {
      pitch: 1.2,
      rate: 0.7,
      voice: voice ?? selectedVoice,
    });
  };

  return { play };
}
