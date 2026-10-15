import { useEffect, useState } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';

import AddTodo from '../../components/SearchWord';
import { fetchWordOfTheDay } from '../../api';
import WordsOfTheDay from '../../components/WordsOfTheDay';
import NotificationsModal from '../../components/NotificationsModal';

export function Home() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const [words, setWordsOfTheDay] = useState<string[]>([]);

  useEffect(() => {
    fetchWordOfTheDay().then((result) => {
      if (result) {
        setWordsOfTheDay(result.words);
      }
    });
  }, []);

  const [yAnim] = useState(() => new Animated.Value(0));
  const [rot] = useState(() => new Animated.Value(0));
  const [isClosed, setisClosed] = useState(false);
  const slide = (toValue: number) => {
    Animated.timing(yAnim, {
      toValue,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setisClosed((v) => !v));

    Animated.timing(rot, {
      toValue: toValue,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const [y, setY] = useState(0);
  const translateY = yAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [y, 0],
  });
  const rotate = rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  return (
    <View className="w-full h-full ">
      <AddTodo slide={slide} isClosed={isClosed} setY={setY} />

      {isPortrait && (
        <WordsOfTheDay
          words={words}
          slide={slide}
          rotate={rotate}
          translateY={translateY}
          isClosed={isClosed}
          y={y}
        />
      )}
      <NotificationsModal />
    </View>
  );
}
