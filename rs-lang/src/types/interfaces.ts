export interface IPageData {
  name: string;
  hash: string;
  id: string;
}

export interface IWordData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IUserData {
  name?: string;
  email: string;
  password: string;
}

export interface IUserRegData {
  id: string;
  name: string;
  email: string;
}

export interface IUserRegRequest {
  success?: IUserRegData;
  error?: string;
}

export interface IUserAuthData {
  message?: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IUserAuthRequest {
  success?: IUserAuthData;
  error?: string;
}

export interface INewTokens {
  token: string;
  refreshToken: string;
}

export interface IInputDataUserWord {
  difficulty?: string;
  optional?: {
    isLearned?: boolean;
    isNew?: boolean;
  }
}

export interface IOutputDataUserWord extends IInputDataUserWord {
  id: string;
  wordId: string;
}

export interface IUserWordRequest {
  success?: IInputDataUserWord;
  error?: string;
}

export interface IAggregatedWordData extends IWordData {
  userWord: IInputDataUserWord;
}

export interface IAggregatedWords {
  paginatedResults: IAggregatedWordData[];
  totalCount: { count: number }[];
}

export interface IAggregatedWordsRequest {
  set: IAggregatedWordData[];
  count: number;
}

export interface IDeveloperData {
  name: string;
  githubName: string;
  role: string;
  contribution: string;
}

export interface IVariantInfo {
  index: number;
  label: string;
  target: HTMLElement;
}

export interface IWordData {
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  id: string;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
}

export interface IUserAnswer {
  meaning: string;
  audio: string;
}

export interface IUserAnswersCount {
  correct: Array<IUserAnswer>;
  wrong: Array<IUserAnswer>;
}
