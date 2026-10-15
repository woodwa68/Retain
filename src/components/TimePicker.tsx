import { useState } from 'react';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { View, Button } from 'react-native';
import { useSettingsStore } from '../store/settingStore';
import { useTheme } from '../utils/theme';

export default function TimePicker() {
  const { setNotificationTime, notificationTime } = useSettingsStore((state) => state);
  const [date, setDate] = useState(notificationTime);
  const [show, setShow] = useState(false);
  const theme = useTheme();

  return (
    <View>
      <Button title="Pick a Time" color={theme.colors.secondary} onPress={() => setShow(true)} />
      {show && date.getDate() && (
        <DateTimePicker
          value={date}
          onValueChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              setNotificationTime(selectedDate);
              setDate(selectedDate);
            }
          }}
          is24Hour={false}
          onDismiss={() => {
            setShow(false);
          }}
          mode="time"
        />
      )}
    </View>
  );
}
