import { create } from 'axios';

export const apiClient = create({
  baseURL: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
});
export const backupApiClient = create({
  baseURL: 'https://freedictionaryapi.com/api/v1/entries/en/',
});

export async function fetchWordOfTheDay(): Promise<{
  words: string[];
} | null> {
  try {
    const response = await fetch('https://www.merriam-webster.com/wotd/feed/rss2');
    const text = await response.text();

    // Parse the word from the RSS XML
    const titleMatch = text.match(/<\/guid><title>.*<\/title>/g);
    const descMatch = text.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/);

    const words = titleMatch?.map((data) =>
      data.replaceAll('</guid><title><![CDATA[', '').replaceAll(']]></title>', ''),
    );
    if (!words) return null;

    return { words };
  } catch (e) {
    console.error('Failed to fetch word of the day:', e);
    return null;
  }
}
