import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createZustandStorage, wordHistoryStorage } from './mmkv';
import { DictionaryApiResponse } from '../types/types';

type HistoryState = {
  history: DictionaryApiResponse[][];
  historyCount: number;
  intentWord: string;
  setIntentWord: (intentWord: string) => void;
  setHistory: (history: DictionaryApiResponse[][]) => void;
  addToHistory: (entry: DictionaryApiResponse[]) => void;
  removeFromHistory: (word: string) => void;
  clearHistory: () => void;
  firstLogin: boolean;
  setFirstLogin: () => void;
};

export const useStore = create<HistoryState>()(
  persist(
    (set) => ({
      firstLogin: true,
      setFirstLogin: () => set(() => ({ firstLogin: false })),
      history: [],
      historyCount: 0,
      intentWord: '',
      setIntentWord: (intentWord) =>
        set(() => {
          return { intentWord };
        }),
      setHistory: (history) => set({ history }),
      addToHistory: (entry: DictionaryApiResponse[]) =>
        set((state) => {
          state.historyCount++;

          const existingHistory = state.history;
          const newHistory = { history: [...existingHistory, [...entry]] };
          return newHistory;
        }),
      removeFromHistory: (word: string) => {
        set((state) => {
          state.historyCount--;
          return {
            history: state.history.filter((historyWord) =>
              historyWord[0].word !== word ? true : false,
            ),
          };
        });
      },
      clearHistory: () => {
        set(() => {
          return {
            history: [],
            historyCount: 0,
          };
        });
      },
    }),
    {
      name: 'word-history',
      storage: createJSONStorage(() => createZustandStorage(wordHistoryStorage)),
    },
  ),
);
