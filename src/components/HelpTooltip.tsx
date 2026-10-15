import { CircleQuestionMark } from 'lucide-react-native';
import React, { PropsWithChildren, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../utils/theme';

type HelpTooltipProps = PropsWithChildren<{
  text: string;
}>;

export default function HelpTooltip({ text, children }: HelpTooltipProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Pressable
        accessibilityHint="Opens help information"
        accessibilityLabel="Help"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => setVisible(true)}>
        <CircleQuestionMark size={16} color={'red'} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <Pressable
          // className={[theme]}
          style={styles.backdrop}
          onPress={() => setVisible(false)}>
          <Pressable style={[theme, styles.tooltip]} onPress={(event) => event.stopPropagation()}>
            <Text style={[theme, styles.text]}>{text}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close help"
              onPress={() => setVisible(false)}
              style={styles.closeButton}>
              <Text style={(styles.close, { color: 'red' })}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  tooltip: {
    borderRadius: 10,
    elevation: 4,
    maxWidth: 360,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: '100%',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  close: {
    color: '#2563eb',
    fontWeight: '600',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    height: 20,
    lineHeight: 20,
    textAlign: 'center',
    width: 20,
  },
});
