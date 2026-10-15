import { useState } from 'react';
import { Animated, Image } from 'react-native';
import Svg from 'react-native-svg';
import { DrawPath } from './DrawPath';

import BootSplash from 'react-native-bootsplash';
import BrainAnimation from '../assets/brainAnimation.svg';
import { useTheme } from '../utils/theme';

type Props = {
  onAnimationEnd: () => void;

  isLoadingIndicator?: boolean;
};

const AnimatedBrain = ({ onAnimationEnd, isLoadingIndicator = false }: Props) => {
  const [opacity] = useState(() => new Animated.Value(1));
  const [scale] = useState(() => new Animated.Value(1));
  const theme = useTheme();

  const { container, logo } = BootSplash.useHideAnimation({
    manifest: require('../../src/assets/bootsplash/manifest.json'),
    logo: require('../../src/assets/bootsplash/logo.png'),

    animate: () => {
      Animated.parallel([
        Animated.timing(opacity, {
          useNativeDriver: true,
          toValue: 1,
          duration: 1500,
        }),
        Animated.sequence([
          Animated.timing(scale, {
            useNativeDriver: true,
            toValue: 0.85,
            duration: 600,
          }),
          Animated.timing(scale, {
            useNativeDriver: true,
            toValue: 1,
            duration: 600,
          }),
        ]),
      ]).start(({ finished }) => {
        if (!finished) return;
        BootSplash.hide();
        requestAnimationFrame(() => {
          onAnimationEnd();
        });
      });
    },
  });

  return (
    <Animated.View
      {...container}
      style={[
        container.style,
        {
          opacity,
          position: 'absolute',
          backgroundColor: isLoadingIndicator ? 'transparent' : 'white',
        },
      ]}>
      <Animated.View
        style={{
          width: logo.style?.width,
          height: logo.style?.height,
          transform: [{ scale }],
        }}>
        <Image
          {...logo}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
          }}
        />
        <Svg preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
          <BrainAnimation width={'100%'} height={'100%'} />
          <DrawPath
            stroke={isLoadingIndicator ? theme.backgroundColor : '#FFF'}
            d={
              'M534,1542c389.594,401.51,619.04,541.46,829.3,369.29,217.16-177.81,290.02-335.23,581.7-253.29,251.07,70.53,508.04,114.53,601-160,118.15-348.91,104.64-135.78,35-359-52.55-168.455-367.76-86.73-336-584,22.92-358.807,388.62-428.673,893-413s2860.75,971.84,2333,2333c-283.15,730.29-527.57,559.47-709,481-156.43-67.66-206.08-164.53-245-291s-78.57-262.55-314-237c-220.54,23.93-24.4-7.49-245,48'
            }
            delay={0}
          />
          <DrawPath
            stroke={isLoadingIndicator ? theme.backgroundColor : '#FFF'}
            d={
              'M3264,978c-134.42,133.94-78.32,130.43-242,188-224.04,78.81-275.03,42.42-397,198-100.11,127.71-71.25,260.44-134,276s-189.43,39.32-284,197-80.83,316.57,32,400,283.09,136.3,492,65c261.11-89.11,243.48-70.62,403-106,193.55-42.92,312.76-62.84,385-214,130.17-272.37,135.58-289.82,278-414s296.56-47.75,397-83,319.41-201.66,302-551,586.69-486.073,741,302c252.11,1287.54,194.39,2134.3-368,2282s-1078.59-6.41-1173-214c-95.36-209.68-76.07-230.53-100-266'
            }
            delay={150}
          />
          <DrawPath
            stroke={isLoadingIndicator ? theme.backgroundColor : '#FFF'}
            d={
              'M1717,2978c71.59-349.28,153.74-479.43,314-586s229.6-102.39,357-83c153.58,23.38,224.58,40.98,414-24s202.55-82.55,504-101c283.99-17.38,373.73-22.03,563,173s40.66,508.47-72,562-206.5,154.1-509,89-266.28-18.06-385,71c-122.55,91.93-76.68,485.74-83,557s822.39,1243.71,1599,758,1113.89-1415.44,871-1949-332.18-599.82-704-563'
            }
            delay={250}
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedBrain;
