import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Chonburi, Domine, useTheme } from '../utils/theme';
import { useStore } from '../store/store';
import Brain from '../../assets/brain.svg';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationsModal() {
  const theme = useTheme();
  const { firstLogin, setFirstLogin } = useStore((state) => state);
  const [modalVisible, setModalVisible] = useState(firstLogin);
  const { registerForPushNotifications } = useNotifications();

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View
          className={`w-full h-full p-4 items-center justify-center ${theme.dark ? 'bg-[#86868675]' : 'bg-[#68686880]'}`}>
          <View
            style={theme}
            className="flex-col border-black rounded-[8] items-center justify-center gap-4 p-4">
            <Brain width={140} height={140} color={'red'} />
            <Text style={[Chonburi(0), { fontSize: 30, maxWidth: '80%', textAlign: 'center' }]}>
              Learn and Retain words
            </Text>
            <Text className="p-4" style={[Domine(400), { fontSize: 18 }]}>
              {`A little repetition goes a long way.`}
              <Text style={[Domine(800), { fontSize: 18 }]}>Turn on notifications</Text>
              {` and we'll help you review yesterday's words every morning.`}
            </Text>
            <Text className="p-4" style={[Domine(400), { fontSize: 18 }]}>
              {`Every word you look up gets saved automatically and we'll help you actually remember them.`}
            </Text>

            <View className="flex-row justify-evenly items-center w-full">
              <TouchableOpacity
                onPress={() => {
                  setFirstLogin();
                  setModalVisible(false);
                }}>
                <Text style={[theme, Domine(400), { fontSize: 18 }]}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-[6] bg-[red] p-3"
                onPress={() => {
                  registerForPushNotifications();
                  setFirstLogin();
                  setModalVisible(false);
                }}>
                <Text style={[Domine(400), { fontSize: 18, color: 'white' }]}>
                  Enable Notifications
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
