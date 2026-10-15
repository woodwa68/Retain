// @refresh reset
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store/store';
import { Chonburi, Domine, useTheme } from '../utils/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ChevronUp } from 'lucide-react-native';
import { useFontScaling } from '../hooks/useFontScaling';

type WordsOfTheDayProps = {
  slide: (value: number) => void;
  rotate: Animated.AnimatedInterpolation<string | number>;
  translateY: Animated.AnimatedInterpolation<string | number>;
  isClosed: boolean;
  y: number;
  words?: string[];
};

export default function WordsOfTheDay({
  slide,
  rotate,
  isClosed,
  translateY,
  words = [],
  y,
}: WordsOfTheDayProps) {
  const setIntentWord = useStore((state) => state.setIntentWord);
  const tabHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const theme = useTheme();

  const { fontScale, textProps, scaledTypography } = useFontScaling();

  // Use fontScale for size calculations
  const size = 24 * fontScale;

  const [anim] = useState(() =>
    Array(10)
      .fill(0)
      .map(() => new Animated.Value(0)),
  );

  useEffect(() => {
    if (words.length === 0) return;
    anim.forEach((anim, i) => {
      Animated.delay(i * 100).start(({ finished }) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [anim, words.length]);

  const { width, height } = Dimensions.get('window');
  const translateX = anim.map((a) =>
    a.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, 0],
    }),
  );

  return (
    <Animated.View
      className={`absolute  justify-center items-center bg-red pb-[100%]`}
      style={[
        theme,
        {
          top: height - headerHeight - tabHeight * 2,
          left: 0,
          right: 0,
          transform: [{ translateY }],
        },
      ]}>
      <View className="flex justify-center items-center border-t border-b border-[lightgray] w-full mb-5  ">
        <Pressable
          className=" w-full justify-center items-center"
          onPress={() => slide(isClosed ? 0 : 1)}>
          <Animated.View
            style={{
              zIndex: 500,
              elevation: 500,
              transform: [{ translateY: 8 }, { rotate }, { translateY: -8 }],
            }}>
            <ChevronUp
              size={16}
              color={'gray'}
              style={{
                position: 'absolute',
                top: 0,
                left: -8,
              }}
            />
          </Animated.View>
          <Text
            className="font-bold text-[28px] w-full text-center"
            style={[
              theme,
              { backgroundColor: theme.colors.card },
              Chonburi(),
              { fontSize: 30, height: tabHeight, lineHeight: tabHeight },
            ]}>
            Words of the Day
          </Text>
        </Pressable>
      </View>

      {words.length === 0 ? (
        <></>
      ) : (
        words.map((item, index) => (
          <Animated.View
            key={`${item}-${index}`}
            style={[{ transform: [{ translateX: translateX[index] }] }, { height: height / 20 }]}>
            <TouchableOpacity onPress={() => setIntentWord(item)}>
              <Text style={[theme, Domine(400), { fontSize: 25 * fontScale }]}>{item}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))
      )}
    </Animated.View>
  );
}
