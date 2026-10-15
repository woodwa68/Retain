import { createBottomTabNavigator, createBottomTabScreen } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { Linking, TouchableOpacity, View, Image } from 'react-native';
import { Home } from './screens/Home';
import { Settings } from './screens/Settings';
import { History } from './screens/History';
import Github from '../assets/Octicons-mark-github.svg';

import {
  createDrawerNavigator,
  createDrawerScreen,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Toggle from '../components/Toggle';
import Brand from '../components/Brand';
import { ScrollText, SearchAlert } from 'lucide-react-native';
import { useSettingsStore } from '../store/settingStore';
const bmc = require('../assets/bmc-button.png');

function CustomDrawerContent(props: any) {
  const settings = useSettingsStore((state) => state);
  return (
    <DrawerContentScrollView
      {...props}

      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-row justify-around mb-5 h-[15%] items-center">
        <View className="flex-row items-center">
          <Brand />
        </View>
        <Toggle size={48} action={settings.toggleTheme} />
      </View>
      <DrawerItemList {...props} />
      <View className="flex-1 items-center gap-1">
        <View className="flex-[8] w-full h-full"></View>
        <TouchableOpacity
          className="w-full justify-center items-center flex-[8]"
          onPress={() => Linking.openURL('https://buymeacoffee.com/kyle_woodward')}>
          <Image className="w-[80%] h-full" source={bmc} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-[1] flex-row gap-4 w-[65%] items-center ">
          <Github width={'15%'} height={'100%'} color={'gray'} />
          <View
            className="flex-[3] border-l-2 pl-2 items-center justify-center"
            style={{ borderColor: 'gray' }}>
            <Text
              style={{
                fontSize: 19,
                color: 'gray',
                flexWrap: 'wrap',
                textAlign: 'center',
              }}>
              Made with React Native and Expo
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const HomeTabs = createBottomTabNavigator({
  screenOptions: { headerShown: false },

  screens: {
    Home: createBottomTabScreen({
      screen: Home,
      options: {
        title: 'Search',
        tabBarIcon: ({ color, size }) => <SearchAlert color={color} size={size} />,
      },
    }),
    History: createBottomTabScreen({
      screen: History,
      options: {
        tabBarIcon: ({ color, size }) => <ScrollText size={size} color={color} />,
      },
    }),
  },
});
const MyDrawer = createDrawerNavigator({
  drawerContent: CustomDrawerContent,

  screens: {
    Home: createDrawerScreen({
      screen: HomeTabs,
      options: {
        headerTitleAlign: 'center',
        headerTitle: (props) => (
          <View className="flex-row items-center justify-center">
            <Brand />
          </View>
        ),
      },
    }),
    Settings: createNativeStackScreen({
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: 'modal',
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    }),
  },
});
const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: { screen: MyDrawer, options: { headerShown: false } },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackType = typeof RootStack;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType {}
}
