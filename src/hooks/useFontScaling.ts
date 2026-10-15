import { useEffect, useState } from 'react';
import { Dimensions, Platform, ScaledSize, useWindowDimensions } from 'react-native';
import { getScaledTypography } from '../utils/typography';

const MIN_FONT_SCALE = 0.941;
const MAX_FONT_SCALE = Platform.OS === 'ios' ? 1.235 : 1.3;

function clampFontScale(scale: number): number {
  return Math.min(Math.max(scale, MIN_FONT_SCALE), MAX_FONT_SCALE);
}

export function useFontScaling() {
  const { fontScale } = useWindowDimensions();
  const clampedFontScale = clampFontScale(fontScale);

  const [scaledTypography, setScaledTypography] = useState(() =>
    getScaledTypography(clampedFontScale),
  );

  useEffect(() => {
    const handleDimensionsChange = ({ window }: { window: ScaledSize }) => {
      const clampedScale = clampFontScale(window.fontScale);
      setScaledTypography(getScaledTypography(clampedScale));
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Apply both maxFontSizeMultiplier AND accessible font scaling limits
  const textProps = {
    maxFontSizeMultiplier: 1,
    allowFontScaling: true,
  };

  return {
    scaledTypography,
    fontScale: clampedFontScale,
    textProps,
  };
}
