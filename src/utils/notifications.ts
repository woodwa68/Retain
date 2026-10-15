import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, NativeModules } from 'react-native';
import { DictionaryApiResponse } from '../types/types';

interface NotificationModuleInterface {
  showWordNotification(word: string, definition: string, notifId: number): Promise<void>;
  canScheduleExactAlarms(): Promise<boolean>;
  cancelWordNotification(id: number): Promise<void>;
  requestExactAlarmPermission(): Promise<void>;
  scheduleWordNotification(
    word: string,
    definition: string,
    notifId: number,
    time: number,
  ): Promise<void>;
}

export const { NotificationModule } = NativeModules as {
  NotificationModule: NotificationModuleInterface | undefined;
};

export async function showWordNotification(
  word: string,
  definition: string,
  notifId: number,
): Promise<void> {
  if (Platform.OS !== 'android' || !NotificationModule) return;
  await NotificationModule.showWordNotification(word, definition, notifId);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('custom_word_channel_no_expo', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'silent.wav',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    finalStatus = (await Notifications.requestPermissionsAsync()).status;
  }

  const granted = await ensureExactAlarmPermission();
  if (!granted) {
    // show your own UI explaining they need to enable it, since you can't
    // know synchronously whether they actually granted it after returning
  }
  if (finalStatus !== 'granted') return null;

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) throw new Error('Project ID not found');

    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function ensureExactAlarmPermission() {
  if (Platform.OS !== 'android' || !NotificationModule) return true;

  const canSchedule = await NotificationModule.canScheduleExactAlarms();

  if (canSchedule) return true;

  // No dialog exists for this — deep-link to system settings instead
  await NotificationModule.requestExactAlarmPermission();

  return false; // there's no callback for when they return — see note below
}

export const cancelNotifications = (isDaily: boolean, words: DictionaryApiResponse[][]) => {
  Notifications.getAllScheduledNotificationsAsync().then((a) => console.log(a));
  words.map((entry) =>
    Notifications.cancelScheduledNotificationAsync(
      `${isDaily ? 'daily' : 'weekly'}-word-digest-${entry[0].word}`,
    ),
  );
};

export const scheduleWordNotification = async (
  word: string,
  body: string,
  time: Date,
  notifId: number,
) => {
  if (Platform.OS === 'android' && NotificationModule) {
    await NotificationModule.scheduleWordNotification(word, body, notifId, time.getTime());
  } else {
    //ios
    await Notifications.scheduleNotificationAsync({
      identifier: `word-digest-${word}`,
      content: {
        title: word,
        body,
        sound: true,
        data: { word, definition: body, notifId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: time,
      },
    });
  }
};

export async function scheduleNotifications(
  time: Date,
  word: string,
  body: string,
  shouldRevealDefinition: boolean,
  daily: boolean,
) {
  if (!shouldRevealDefinition) {
    scheduleWordNotification(word, body, time, time.getTime() % 2147483647);
    return;
  }
  const notificationData = (isDaily: boolean) => {
    return {
      identifier: `${isDaily ? 'daily' : 'weekly'}-word-digest-${word}`,

      content: {
        title: word,
        body: body,
        sound: true,
        data: {
          word,
          definition: body,
          notifId: Date.now() % 2147483647,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: time,
        channelId: 'custom_word_channel_no_expo',
      },
    };
  };

  if (!word || !body) return;

  await Notifications.scheduleNotificationAsync(notificationData(daily));
}

export const getSampleWordHistory = () => {
  return [
    [
      {
        word: 'hegemony',
        phonetic: '/hɪˈdʒɛm.ə.ni/',
        phonetics: [
          {
            text: '/hɪˈdʒɛm.ə.ni/',
            audio: '',
          },
          {
            text: '/həˈdʒɛm.ə.ni/',
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/hegemony-us.mp3',
            sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=1541852',
            license: {
              name: 'BY-SA 3.0',
              url: 'https://creativecommons.org/licenses/by-sa/3.0',
            },
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  'Domination, influence, or authority over another, especially by one political group over a society or by one nation over others.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition:
                  'Dominance of one social group over another, such that the ruling group or hegemon acquires some degree of consent from the subordinate, as opposed to dominance purely by force.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/hegemony'],
      },
    ],
    [
      {
        word: 'apartheid',
        phonetic: '/əˈpɑːthaɪt/',
        phonetics: [
          {
            text: '/əˈpɑːthaɪt/',
            audio: '',
          },
          {
            text: '/əˈpɑɹ.taɪd/',
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/apartheid-us.mp3',
            sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=7467871',
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  'The policy of racial separation used by South Africa from 1948 to 1990.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition:
                  '(by extension) Any similar policy of racial separation/segregation and discrimination.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition:
                  '(by extension) A policy or situation of segregation based on some specified attribute.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
          {
            partOfSpeech: 'verb',
            definitions: [
              {
                definition:
                  'To impose a policy of segregation of groups of people, especially one based on race.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: ['antiapartheid'],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/apartheid'],
      },
    ],
    [
      {
        word: 'jingoism',
        phonetic: '/ˈdʒɪŋɡəʊɪz(ə)m/',
        phonetics: [
          {
            text: '/ˈdʒɪŋɡəʊɪz(ə)m/',
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/jingoism-uk.mp3',
            sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=89321933',
            license: {
              name: 'BY-SA 4.0',
              url: 'https://creativecommons.org/licenses/by-sa/4.0',
            },
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  'Excessive patriotism or aggressive nationalism, especially with regards to foreign policy.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'A jingoistic attitude, comment, etc.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'Chauvinism.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: ['chauvinism', 'flagwaving'],
            antonyms: [],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/jingoism'],
      },
    ],
    [
      {
        word: 'communism',
        phonetic: '/ˈkɒm.juˌnɪzm̩/',
        phonetics: [
          {
            text: '/ˈkɒm.juˌnɪzm̩/',
            audio: '',
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  'Any political ideology or philosophy advocating holding the production of resources collectively.',
                synonyms: ['aspheterism'],
                antonyms: [],
              },
              {
                definition:
                  'Any political social system that implements a communist political philosophy.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition:
                  'The international socialist society where classes, money, and the state no longer exist.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: ['aspheterism'],
            antonyms: [],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/communism'],
      },
    ],
    [
      {
        word: 'sycophants',
        phonetics: [],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  'One who uses obsequious compliments to gain self-serving favor or advantage from another; a servile flatterer.',
                synonyms: ['ass-kisser', 'brown noser', 'suck up', 'yes man'],
                antonyms: [],
              },
              {
                definition: 'One who seeks to gain through the powerful and influential.',
                synonyms: ['flunky', 'lackey', 'parasite'],
                antonyms: [],
              },
              {
                definition: 'An informer; a talebearer.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [
              'ass-kisser',
              'brown noser',
              'suck up',
              'yes man',
              'flunky',
              'lackey',
              'parasite',
            ],
            antonyms: [],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: [
          'https://en.wiktionary.org/wiki/sycophant',
          'https://en.wiktionary.org/wiki/sycophants',
        ],
      },
    ],
    [
      {
        word: 'feckless',
        phonetics: [
          {
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/feckless-au.mp3',
            sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=75796723',
            license: {
              name: 'BY-SA 4.0',
              url: 'https://creativecommons.org/licenses/by-sa/4.0',
            },
          },
          {
            text: '/ˈfɛkləs/',
            audio: '',
          },
          {
            text: '/ˈfɛkləs/',
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/feckless-us.mp3',
            sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=3861352',
            license: {
              name: 'BY-SA 3.0',
              url: 'https://creativecommons.org/licenses/by-sa/3.0',
            },
          },
        ],
        meanings: [
          {
            partOfSpeech: 'adjective',
            definitions: [
              {
                definition: 'Lacking purpose.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'Without skill, ineffective, incompetent.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'Lacking the courage to act in any meaningful way.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'Lacking vitality.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [
              'feeble',
              'futile',
              'hopeless',
              'ineffective',
              'ineffectual',
              'meaningless',
              'useless',
              'aimless',
              'careless',
              'irresponsible',
              'reckless',
              'unpurposed',
              'worthless',
            ],
            antonyms: [
              'effective',
              'efficient',
              'meaningful',
              'useful',
              'careful',
              'purposeful',
              'responsible',
            ],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/feckless'],
      },
    ],
    [
      {
        word: 'cynical',
        phonetic: '/ˈsɪnɪkəl/',
        phonetics: [
          {
            text: '/ˈsɪnɪkəl/',
            audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/cynical-us.mp3',
            sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=2650824',
            license: {
              name: 'BY-SA 3.0',
              url: 'https://creativecommons.org/licenses/by-sa/3.0',
            },
          },
        ],
        meanings: [
          {
            partOfSpeech: 'adjective',
            definitions: [
              {
                definition:
                  'Of or relating to the belief that human actions are motivated only or primarily by base desires or selfishness.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'Skeptical of the integrity, sincerity, or motives of others.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: 'Bitterly or jadedly distrustful or contemptuous; mocking.',
                synonyms: [],
                antonyms: [],
              },
              {
                definition: "Showing contempt for accepted moral standards by one's actions.",
                synonyms: [],
                antonyms: [],
              },
              {
                definition:
                  'Like the actions of a snarling dog, especially in reference to facial nerve paralysis.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/cynical'],
      },
    ],
  ];
};
