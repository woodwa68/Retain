import { useSettingsStore } from '../store/settingStore';
import { TextStyle } from 'react-native';

export const Chonburi = (
  letterSpacing = -2,
): {
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing: number;
} => {
  return {
    fontFamily: 'Chonburi',
    fontWeight: '400',
    letterSpacing: letterSpacing,
  };
};

export const Domine = (
  weight: TextStyle['fontWeight'],
): {
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
} => {
  return {
    fontFamily: 'Domine',
    fontWeight: weight,
  };
};
export function useTheme() {
  const settings = useSettingsStore((state) => state);
  const isDark = settings.darkOrLightMode;
  return {
    backgroundColor: isDark ? '#1c1c1c' : '#e8e8e8',
    color: isDark ? '#e8e8e8' : '#1c1c1c',
    dark: isDark,
    colors: {
      border: isDark ? '#1c1c1c' : '#e8e8e8',
      primary: !isDark ? '#1c1c1c' : '#e8e8e8',
      secondary: '#007AFF',
      background: !isDark ? '#e8e8e8' : '#1c1c1c',
      card: !isDark ? '#FFFFFE' : '#000001',
      text: !isDark ? '#1c1c1c' : '#e8e8e8',
    },
    fonts: { regular: { fontFamily: 'Roboto ', fontWeight: 'normal' } },
  };
}
