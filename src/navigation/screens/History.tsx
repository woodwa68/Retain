import { Text } from '@react-navigation/elements';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useStore } from '../../store/store';
import WordEntry from '../../components/WordEntry';
import { Domine, useTheme } from '../../utils/theme';

export function History() {
  const theme = useTheme();
  const clearHistory = useStore((state) => state.clearHistory);
  //clearHistory();
  const wordHistory = useStore((state) => state.history);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex h-full">
      <FlatList
        data={wordHistory}
        ListEmptyComponent={() => <View style={theme}></View>}
        renderItem={(d) => {
          return <WordEntry data={d.item} isCollapsible index={d.index} />;
        }}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="flex-row w-full items-center justify-center bg-[red] p-2">
          <Text className="text-center text-[#fff] " style={{ color: 'white' }}>
            Clear History
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View
          className={`w-full h-full items-center justify-center ${theme.dark ? 'bg-[#86868675]' : 'bg-[#68686880]'}`}>
          <View
            style={theme}
            className="flex-col w-[50%] h-[25%] border-black rounded-[8] items-center justify-center gap-8">
            <Text style={[Domine(800), { fontSize: 24 }]}>Clear History</Text>
            <TouchableOpacity
              onPress={() => {
                clearHistory();
                setModalVisible(false);
              }}>
              <Text style={[theme, Domine(400), { fontSize: 18 }]}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-[6] bg-[red] p-3"
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={[Domine(400), { fontSize: 18, color: 'white' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
