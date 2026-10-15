import React from 'react';
import { Platform, Text, type ViewStyle } from 'react-native';
import { Chonburi, useTheme } from '../utils/theme';
import Brain from '../../assets/brain.svg';

type BrandProps = {
  style?: ViewStyle;
};

export default function Brand({ style }: BrandProps) {
  const theme = useTheme();
  return (
    <>
      <Brain
        width={Platform.OS === 'ios' ? 30 : 40}
        height={Platform.OS === 'ios' ? 30 : 40}
        color={'red'}
      />
      <Text
        style={[
          theme.colors.text === '#1c1c1c' ? { color: '#1c1c1c' } : { color: '#e8e8e8' },
          Chonburi(),
          { fontSize: Platform.OS === 'ios' ? 30 : 40 },
        ]}>
        Retain
      </Text>
    </>
  );

  /*
  <View className=" h-[250px]">
        <Brain
          width={Platform.OS === "ios" ? 30 : 120}
          height={Platform.OS === "ios" ? 30 : 120}
          style={{
            color: "red",
            position: "absolute",

            transform: [{ translateY: -40 }],
          }}
        />

        <Text
          style={[
            {
              lineHeight: 38,
              textShadowColor: "white",
              textShadowOffset: { width: -2, height: -2 },
              textShadowRadius: 1,
            },
            theme.colors.text === "#1c1c1c"
              ? { color: "#1c1c1c" }
              : { color: "#e8e8e8" },
            Chonburi(),
            { fontSize: Platform.OS === "ios" ? 30 : 40 },
          ]}
        >
          Retain
        </Text>
        <Text
          style={[
            { position: "absolute", zIndex: 0 },
            {
              lineHeight: 38,
              textShadowColor: "white",
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 1,
            },
            { lineHeight: 38 },
            theme.colors.text === "#1c1c1c"
              ? { color: "" }
              : { color: "#e8e8e8" },
            Chonburi(),
            { fontSize: Platform.OS === "ios" ? 30 : 40 },
          ]}
        >
          Retain
        </Text>
        <Text
          style={[
            { position: "absolute", zIndex: 0 },
            {
              lineHeight: 38,
              textShadowColor: "white",
              textShadowOffset: { width: -2, height: 2 },
              textShadowRadius: 1,
            },
            { lineHeight: 38 },
            theme.colors.text === "#1c1c1c"
              ? { color: "" }
              : { color: "#e8e8e8" },
            Chonburi(),
            { fontSize: Platform.OS === "ios" ? 30 : 40 },
          ]}
        >
          Retain
        </Text>
        <Text
          style={[
            { position: "absolute", zIndex: 0 },
            {
              lineHeight: 38,
              textShadowColor: "white",
              textShadowOffset: { width: 2, height: -2 },
              textShadowRadius: 1,
            },
            { lineHeight: 38 },
            theme.colors.text === "#1c1c1c"
              ? { color: "" }
              : { color: "#e8e8e8" },
            Chonburi(),
            { fontSize: Platform.OS === "ios" ? 30 : 40 },
          ]}
        >
          Retain
        </Text>
      </View>
  
  */
}
