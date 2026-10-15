import "@expo/metro-runtime"; // Necessary for Fast Refresh on Web
import { registerRootComponent } from "expo";

import { BackgroundNotificationTaskResult } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import RNHapticFeedback from "react-native-haptic-feedback";

import { App } from "./src/App";
import { showWordNotification } from "./src/utils/notifications";
import { Alert } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    //console.log(notification);
    const { word, definition, notifId } =
      notification?.request?.content?.data ?? {};

    /*  if (word && definition) {
      await showWordNotification(word, definition, notifId ?? Date.now());
    } */

    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("./ReactotronConfig");
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
