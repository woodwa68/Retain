import { Dimensions, Pressable, TextInput, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import { ScrollView } from 'react-native-gesture-handler';

import { useStore } from '../store/store';
import WordEntry from './WordEntry';

import { scheduleNotifications } from '../utils/notifications';
import { useSettingsStore } from '../store/settingStore';
import { Search } from 'lucide-react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AnimatedBrain from './AnimatedBrain';
import { useWordSearch } from '../hooks/useWordSearch';

const SearchWord = ({
  slide,
  isClosed,
  setY,
}: {
  isClosed: boolean;
  slide: (value: number) => void;
  setY: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [text, setText] = useState('');
  const [submit, setSubmit] = useState('');
  const {
    shouldRevealDefinition,
    dailyNotifications,
    weeklyNotifications,
    pushEnabled,
    addNotificationEntry,
    notificationTime,
    maxEntries,
  } = useSettingsStore((state) => state);

  //clearHistory();
  const wordHistory = useStore((state) => state.history);
  const addToHistory = useStore((state) => state.addToHistory);

  const lastSearch = React.useRef<string | null>(null);
  const search = useWordSearch(submit);

  const tabh = useBottomTabBarHeight();

  const { height } = Dimensions.get('screen');

  useEffect(() => {
    const debug = true && __DEV__;
    const debugTime = Date.now();
    if (
      search.data &&
      search.data[0] &&
      search.data[0]?.word !== lastSearch.current &&
      !wordHistory.find((w) => search.data && search.data[0] && w[0].word === search.data[0]?.word)
    ) {
      lastSearch.current = search.data[0]?.word;
      addToHistory(search.data);
      if (pushEnabled && dailyNotifications) {
        const daily = new Date();
        daily.setDate(daily.getDate() + 1);
        daily.setHours(notificationTime.getHours(), notificationTime.getMinutes());
        scheduleNotifications(
          debug ? new Date(debugTime + 10000) : daily,
          search.data[0].word /* + " " + search.data[0].meanings[0].partOfSpeech */,
          search.data[0].meanings[0].definitions
            .map((d, i) => {
              if (i + 1 > maxEntries) return null;
              return i + 1 + '. ' + d.definition;
            })
            .filter((v) => v !== null)
            .join('\n\n'),
          shouldRevealDefinition,
          true,
        );
        addNotificationEntry(
          search.data[0].word + '-daily',
          (debug ? debugTime + 10000 : daily.getTime()) % 2147483647,
        );
      }

      if (pushEnabled && weeklyNotifications) {
        const weekly = new Date();
        weekly.setDate(weekly.getDate() + 7);
        weekly.setHours(notificationTime.getHours(), notificationTime.getMinutes());
        scheduleNotifications(
          debug ? new Date(debugTime + 15000) : weekly,
          search.data[0].word /*  + " " + search.data[0].meanings[0].partOfSpeech */,

          search.data[0].meanings[0].definitions
            .map((d, i) => {
              if (i + 1 > maxEntries) return null;
              return i + 1 + '. ' + d.definition;
            })
            .filter((v) => v !== null)
            .join('\n\n'),
          shouldRevealDefinition,
          false,
        );
        addNotificationEntry(
          search.data[0].word + '-weekly',
          (debug ? debugTime + 15000 : weekly.getTime()) % 2147483647,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addNotificationEntry,
    addToHistory,
    dailyNotifications,
    maxEntries,
    notificationTime,
    pushEnabled,
    search.data,
    shouldRevealDefinition,
    weeklyNotifications,
  ]);

  const lookUp = useCallback(
    (intentWord: string) => {
      setSubmit(intentWord);
      setText('');
      if (!isClosed) slide(1);
    },
    [isClosed, slide],
  );

  const { intentWord, setIntentWord } = useStore((state) => state);
  useEffect(() => {
    if (!intentWord) return;

    const word = intentWord;

    const timeout = setTimeout(() => {
      lookUp(word);
      setIntentWord('');
    }, 0);

    return () => clearTimeout(timeout);
  }, [intentWord, lookUp, setIntentWord]);

  return (
    <>
      <View className="w-full p-4">
        <View className="flex-row items-center bg-white rounded-[10px] border border-[lightgray] w-full">
          <TextInput
            className="flex-1 px-4 py-3"
            value={text}
            placeholderTextColor={'gray'}
            placeholder="Search Dictionary"
            onChangeText={setText}
            autoCapitalize="none"
            autoCorrect
            onSubmitEditing={() => {
              lookUp(text);
            }}
          />
          <Pressable
            className="px-4"
            onPress={() => {
              lookUp(text);
            }}>
            <Search size={24} color={'red'} />
          </Pressable>
        </View>
        <View className="p-2"></View>
        <View
          onLayout={(event) => {
            event.currentTarget.measureInWindow((x, y, w, h) => setY(y - (height - tabh * 2)));
          }}
        />

        {submit && (
          <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
            {search.data && <WordEntry data={search.data} />}
          </ScrollView>
        )}
      </View>
      {search.isFetching && (
        <View className="absolute w-[100%] h-[100%] z-0">
          <AnimatedBrain isLoadingIndicator onAnimationEnd={() => {}} />
        </View>
      )}
    </>
  );
};

export default SearchWord;
