// inside WordEntry, per dictionary entry:

import { TouchableOpacity, Text } from 'react-native';
import { usePronunciation } from '../hooks/usePronounciation';
import { useSettingsStore } from '../store/settingStore';
import { useTheme } from '../utils/theme';

export default function Pronounce({ entry, voice }: { entry: string; voice?: string }) {
  const { play } = usePronunciation(entry);
  const settings = useSettingsStore((state) => state);
  const theme = useTheme();

  // in JSX:
  return (
    <TouchableOpacity onPress={() => play(voice)}>
      <Text style={theme}>{voice ?? ''} ▶ 🔊</Text>
    </TouchableOpacity>
  );
}
