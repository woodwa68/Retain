import React, { useState } from 'react';

import { TouchableOpacity, View, Text } from 'react-native';
import { UITextView } from '@bsky.app/react-native-uitextview';
import { Collapsible } from 'react-native-fast-collapsible';
import { useStore } from '../store/store';
import { DictionaryApiResponse } from '../types/types';
import Pronounce from './Pronounce';
import { Chonburi, Domine, useTheme } from '../utils/theme';
import { Trash } from 'lucide-react-native';

const alpha = 'abcdefghijklmnopqrstuvwxyx';

export default function WordEntry({
  data,
  isCollapsible = false,
  index = 0,
}: {
  data: DictionaryApiResponse[];
  isCollapsible?: boolean;
  index?: number;
}) {
  const removeFromHistory = useStore((state) => state.removeFromHistory);
  const theme = useTheme();

  // in JSX:

  const [isVisible, setVisibility] = useState(isCollapsible && index !== 0 ? false : true);

  const toggleVisibility = () => {
    if (!isCollapsible) setVisibility(true);
    else setVisibility((previous) => !previous);
  };

  if (!isCollapsible && !data[0])
    return (
      <View>
        <View
          style={theme}
          className={`p-3  border-b-[1px] border-gray-300 items-center w-full justify-center text-center`}>
          <UITextView
            style={[theme, Domine(800), { fontSize: 16 }]}

            selectable
            uiTextView>
            No Results Found:
            <UITextView
              style={[theme, Domine(400), { fontSize: 16 }]}

              selectable
              uiTextView>
              {' '}
              Double check your spelling!
            </UITextView>
          </UITextView>
        </View>
      </View>
    );

  return (
    <View>
      <View style={theme} className={`p-3  border-b-[1px] border-gray-300`}>
        <TouchableOpacity onPress={toggleVisibility}>
          <View className="flex-row pb-2">
            <Text style={[theme, Chonburi(1), { fontSize: 22 }]}> {data[0].word}</Text>
          </View>
        </TouchableOpacity>
        {isCollapsible && (
          <TouchableOpacity
            className="absolute right-0  p-3 "
            onPress={() => removeFromHistory(data[0].word)}>
            <Trash color={'red'} />
          </TouchableOpacity>
        )}
        {data.map((entry, i) => (
          <View key={entry.word + i}>
            <Collapsible isVisible={isVisible}>
              <View className="flex-row">
                <UITextView style={[theme, Domine(400)]}>{entry.phonetic}</UITextView>
                {i === 0 && <Pronounce entry={entry.word} />}
              </View>
              {entry.meanings &&
                entry.meanings.map((meaning, i) => (
                  <View key={i} className="pb-5">
                    <UITextView style={theme} className={`italic`}>
                      {i + 1 + '. ' + meaning.partOfSpeech}
                    </UITextView>
                    <View style={theme} className={`pl-5`}>
                      {meaning.definitions.map((d, j) => (
                        <View key={d.definition.substring(0, 2) + j}>
                          <UITextView
                            style={[theme, Domine(800), { fontSize: 16 }]}
                            key={j}
                            selectable
                            uiTextView>
                            {alpha[j]})
                            <UITextView
                              style={[theme, Domine(400), { fontSize: 16 }]}
                              key={j}
                              selectable
                              uiTextView>
                              {' ' + d.definition}
                            </UITextView>
                          </UITextView>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
            </Collapsible>
          </View>
        ))}
      </View>
      <View className="h-[1px]  border-b-[1px] border-white "></View>
    </View>
  );
}
