import { NativeModules, Platform } from 'react-native';

interface NotificationPayload {
  word: string;
  definition: string | null;
  notif_word?: string;
}

interface ProcessTextModuleInterface {
  getSelectedText(): Promise<string | null>;
  clearIntent(): Promise<void>;
  getNotificationPayload(): Promise<NotificationPayload | null>;
  clearNotificationPayload(): Promise<void>;
}
const { ProcessTextModule } = NativeModules as {
  ProcessTextModule: ProcessTextModuleInterface | undefined;
};

/**
 * Returns the word/phrase selected in an external app that launched this
 * app via the Android PROCESS_TEXT intent. Returns null on iOS or if the
 * app was opened normally.
 */
export async function getProcessTextWord(): Promise<string | null> {
  if (Platform.OS !== 'android' || !ProcessTextModule) return null;

  try {
    const word = await ProcessTextModule.getSelectedText();
    return word;
  } catch {
    return null;
  }
}

export async function clearNotificationPayload(): Promise<null> {
  if (Platform.OS !== 'android' || !ProcessTextModule) return null;

  await ProcessTextModule.clearNotificationPayload();

  return null;
}

export async function getNotificationPayload(): Promise<string | null> {
  if (Platform.OS !== 'android' || !ProcessTextModule) return null;
  try {
    const payload = await ProcessTextModule.getNotificationPayload();

    return (payload?.word || payload?.notif_word) ?? null;
  } catch {
    return null;
  }
}
/**
 * Clears the intent extra so navigating away and back doesn't re-trigger
 * the lookup. Call this after you've handled the word.
 */
export async function clearProcessTextIntent(): Promise<void> {
  if (Platform.OS !== 'android' || !ProcessTextModule) return;

  try {
    await ProcessTextModule.clearIntent();
  } catch {
    // non-fatal
  }
}
