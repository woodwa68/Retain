import { useEffect, useState } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native'; // or swap for your icon set
import { useSettingsStore } from '../store/settingStore';

export default function Toggle({
  size = 36,
  action,
  setting = 'darkOrLightMode',
}: {
  size: number;
  action: () => void;
  setting?: string;
}) {
  const settings = useSettingsStore((state) => state);
  // @ts-ignore
  const isEnabled = settings[setting];

  const [anim] = useState(() => new Animated.Value(isEnabled ? 1 : 0));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isEnabled ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isEnabled, anim]);

  const trackHeight = size;
  const trackWidth = size * 1.78;
  const padding = size * 0.08;
  const thumbSize = trackHeight - padding * 2;
  const iconSize = thumbSize * 0.5;
  const trackIconSize = thumbSize * 0.42;
  const travel = trackWidth - thumbSize - padding * 2;

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, padding + travel],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: isEnabled }}
      accessibilityLabel="Toggle dark mode"
      onPress={action}
      style={[
        styles.track,
        {
          width: trackWidth,
          height: trackHeight,
          borderRadius: trackHeight / 2,
          backgroundColor: isEnabled ? '#787979' : '#3f3e3e',
        },
        setting !== 'darkOrLightMode' ? { backgroundColor: isEnabled ? '#007AFF' : '#787979' } : {},
      ]}>
      <Sun
        size={trackIconSize}
        color="#cbd5e1"
        style={[
          styles.iconLeft,
          { left: padding * 1.6, opacity: isEnabled ? 0.35 : 1 },
          setting !== 'darkOrLightMode' ? { opacity: 0 } : {},
        ]}
      />
      <Moon
        size={trackIconSize}
        color="#cbd5e1"
        style={[
          styles.iconRight,
          { right: padding * 1.6, opacity: isEnabled ? 1 : 0.35 },
          setting !== 'darkOrLightMode' ? { opacity: 0 } : {},
        ]}
      />

      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            transform: [{ translateX }],
          },
        ]}>
        {isEnabled ? (
          <Moon
            size={iconSize}
            color="#334155"
            style={[setting !== 'darkOrLightMode' ? { opacity: 0 } : {}]}
          />
        ) : (
          <Sun
            size={iconSize}
            color="#334155"
            style={[setting !== 'darkOrLightMode' ? { opacity: 0 } : {}]}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  iconLeft: {
    position: 'absolute',
  },
  iconRight: {
    position: 'absolute',
  },
  thumb: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
