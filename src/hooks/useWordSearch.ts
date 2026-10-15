import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { apiClient, backupApiClient } from '../api';
import { DictionaryApiResponse, FreeDictionaryApiResponse } from '../types/index';

export const wordQueryKey = (word: string) => ['wordSearch', word] as const;
export const useWordSearch = (word: string) => {
  const searchWord = async (word: string) => {
    try {
      const { data } = await apiClient.get<DictionaryApiResponse[]>(`${word}`, { timeout: 2750 });

      return data;
    } catch (error) {
      if (!isAxiosError(error)) throw error;

      const { data } = await backupApiClient.get<FreeDictionaryApiResponse>(`${word}`);

      return data.entries.map((entry) => ({
        word: data.word,
        phonetic: entry.pronunciations[0]?.text,
        meanings: entry.senses.map((s) => ({
          partOfSpeech: entry.partOfSpeech,
          definitions: [
            {
              definition: s.definition,
              synonyms: [],
              antonyms: [],
            },
          ],
          synonyms: [],
          antonyms: [],
        })),
        phonetics: [],
        license: { name: '', url: '' },
        sourceUrls: [],
      }));
    }
  };

  return useQuery({
    queryKey: wordQueryKey(word),
    queryFn: () => searchWord(word),
    enabled: word.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};
