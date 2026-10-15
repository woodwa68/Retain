export interface DictionaryApiResponse {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

export interface License {
  name: string;
  url: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: any[];
  antonyms: any[];
}

export interface Definition {
  definition: string;
  synonyms: any[];
  antonyms: any[];
}

export interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string;
}

export interface FreeDictionaryApiResponse {
  word: string;
  entries: Entry[];
  source: Source;
}

interface Source {
  url: string;
  license: License2;
}

interface License2 {
  name: string;
  url: string;
}

interface Entry {
  language: Language;
  partOfSpeech: string;
  pronunciations: Pronunciation[];
  forms: Form[];
  senses: Sense[];
  synonyms: string[];
  antonyms: any[];
}

interface Sense {
  definition: string;
  tags: string[];
  examples: (string | string)[];
  quotes: (Quote | Quote)[];
  synonyms: string[][];
  antonyms: (string | string)[];
  subsenses: any[];
}

interface Quote {
  text: string;
  reference: string;
}

interface Form {
  word: string;
  tags: string[];
}

interface Pronunciation {
  type: string;
  text: string;
  tags: string[];
}

interface Language {
  code: string;
  name: string;
}
