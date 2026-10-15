// @ts-ignore
import '../global.css';
import { Assets as NavigationAssets } from '@react-navigation/elements';
import { useNavigationContainerRef } from '@react-navigation/native';
import { Asset } from 'expo-asset';

import { View } from 'react-native';
import { Navigation } from './navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../queryClient';
import { useProcessText } from './hooks/useProcessText';
import { StatusBar } from 'expo-status-bar';

import { useSettingsStore } from './store/settingStore';
import { useEffect, useState } from 'react';
import { useTheme } from './utils/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AnimatedBrain from './components/AnimatedBrain';

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

export function App() {
  const navigationRef = useNavigationContainerRef();

  const [isNavReady, setIsNavReady] = useState(false);
  useProcessText(navigationRef, isNavReady);

  const loadVoices = useSettingsStore((s) => s.loadVoices);
  const { isVoicesLoaded, darkOrLightMode } = useSettingsStore((s) => s);

  const theme = useTheme();

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isVoicesLoaded) loadVoices();
  }, [isVoicesLoaded, loadVoices]);

  useEffect(() => {
    StatusBar.setStyle(!darkOrLightMode ? 'dark' : 'light', true);
  }, [darkOrLightMode]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Navigation
            // @ts-ignore
            theme={theme}
            ref={navigationRef}
            onReady={() => {
              setIsNavReady(true);
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>

      {visible && (
        <AnimatedBrain
          onAnimationEnd={() => {
            setVisible(false);
          }}
        />
      )}
    </View>
  );
}
