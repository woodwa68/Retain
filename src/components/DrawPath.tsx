import { useEffect } from 'react';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { useSettingsStore } from '../store/settingStore';
import { useTheme } from '../utils/theme';
import { ColorValue } from 'react-native';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function DrawPath({
  d,
  stroke,
  delay = 0,
}: {
  d: string;
  stroke?: ColorValue | SharedValue<ColorValue | undefined> | undefined;
  delay?: number;
}) {
  const offset = useSharedValue(12000);
  const settings = useSettingsStore((state) => state);
  const theme = useTheme();

  useEffect(() => {
    offset.value = withDelay(delay, withTiming(0, { duration: 1500, easing: Easing.linear }));
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.value,
  }));

  return (
    <AnimatedPath
      d={d}
      stroke={stroke}
      strokeWidth={162}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={12000}
      animatedProps={animatedProps}
    />
  );
}
