import {
  INewTokens,
  IUserRegRequest,
  IUserAuthRequest,
  IUserData,
  IUserRegData,
  IInputDataUserWord,
  IUserWordRequest,
  IWordData,
  IOutputDataUserWord,
  IAggregatedWords,
  IAggregatedWordsRequest
} from 'types/interfaces';

const BASE = 'http://localhost:5000';

const ENDPOINT = {
  WORDS: '/words',
  USERS: '/users',
  SIGNIN: '/signin',
  TOKENS: '/tokens',
  AGGREGATED_WORDS: '/aggregatedWords'
};

const ERROR = {
  REG_USER: 'Пользователь с таким адресом электронной почты уже существует',
  AUTH_USER_EMAIL: 'Пользователя с таким адресом электронной почты не существует',
  AUTH_USER_PASSWORD: 'Неправильный пароль пользователя',
  USER_WORD: 'Такого пользовательского слова не существует'
};

class ApiLearnWords {
  private token: string;
  private refreshToken: string;

  constructor() {
    this.token = localStorage.getItem('authToken');
    this.refreshToken = localStorage.getItem('authRefreshToken');
  }

  public async getWords(group: number, page: number): Promise<IWordData[]> {
    const resp = await fetch(`${BASE}${ENDPOINT.WORDS}?group=${group}&page=${page}`);
    return resp.json();
  }

  public async getWord(id: string): Promise<IWordData> {
    const resp = await fetch(`${BASE}${ENDPOINT.WORDS}/${id}`);
    return resp.json();
  }

  public async registerNewUser(userData: IUserData): Promise<IUserRegRequest> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    return resp.status === 417 ? { error: ERROR.REG_USER } : { success: await resp.json() };
  }

  public async authorizeUser(userData: IUserData): Promise<IUserAuthRequest> {
    const resp = await fetch(`${BASE}${ENDPOINT.SIGNIN}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (resp.status === 404) {
      return { error: ERROR.AUTH_USER_EMAIL };
    }

    if (resp.status === 403) {
      return { error: ERROR.AUTH_USER_PASSWORD };
    }

    return { success: await resp.json() };
  }

  public async getNewUserToken(userId: string): Promise<void> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.TOKENS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
        Accept: 'application/json',
      }
    });
    const newTokens: INewTokens = await resp.json();
    localStorage.setItem('authToken', newTokens.token);
    localStorage.setItem('authRefreshToken', newTokens.refreshToken);
  }

  public async getUser(userId: string): Promise<IUserRegData> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      }
    });

    if (resp.status === 401) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().getUser(userId);
    }

    return resp.json();
  }

  public async createUserWord(userId: string, wordId: string, wordData: IInputDataUserWord): Promise<void> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.WORDS}/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wordData)
    });

    if (resp.status === 401) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().createUserWord(userId, wordId, wordData);
    }
  }

  public async getUserWord(userId: string, wordId: string): Promise<IUserWordRequest> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.WORDS}/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json'
      }
    });

    if (resp.status === 401) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().getUserWord(userId, wordId);
    }

    if (resp.status === 404) {
      return { error: ERROR.USER_WORD };
    }

    const data: IInputDataUserWord = await resp.json();
    return { success: { difficulty: data.difficulty, optional: data.optional } };
  }

  public async updateUserWord(userId: string, wordId: string, wordData: IInputDataUserWord): Promise<void> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.WORDS}/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wordData)
    });

    if (resp.status === 401) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().updateUserWord(userId, wordId, wordData);
    }
  }

  public async deleteUserWord(userId: string, wordId: string): Promise<void> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.WORDS}/${wordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });

    if (resp.status === 401) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().deleteUserWord(userId, wordId);
    }
  }

  private updateUserWordData(userWordData: IInputDataUserWord, wordData: IInputDataUserWord): void {
    userWordData.difficulty = wordData.difficulty || userWordData.difficulty;
    userWordData.optional.isLearned = wordData.optional.isLearned || userWordData.optional.isLearned;
    userWordData.optional.isNew = wordData.optional.isNew || userWordData.optional.isNew;
  }

  public async saveUserWord(userId: string, wordId: string, wordData: IInputDataUserWord): Promise<void> {
    let userWordData = (await this.getUserWord(userId, wordId)).success;

    if (userWordData) {
      this.updateUserWordData(userWordData, wordData);
      await this.updateUserWord(userId, wordId, userWordData);
    } else {
      userWordData = { difficulty: 'easy', optional: { isLearned: false, isNew: false } };
      this.updateUserWordData(userWordData, wordData);
      await this.createUserWord(userId, wordId, userWordData);
    }
  }

  public async getAllUserWords(userId: string): Promise<IOutputDataUserWord[]> {
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.WORDS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });

    if (resp.status === 401 || resp.status === 402) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().getAllUserWords(userId);
    }

    return resp.json();
  }

  public async getAggregatedWords(userId: string, filter: string, wordsPerPage?: string): Promise<IAggregatedWordsRequest> {
    const requestParams = wordsPerPage ? `?wordsPerPage=${wordsPerPage}&filter=${filter}` : `?filter=${filter}`;
    const resp = await fetch(`${BASE}${ENDPOINT.USERS}/${userId}${ENDPOINT.AGGREGATED_WORDS}${requestParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });

    if (resp.status === 401) {
      await this.getNewUserToken(userId);
      await new ApiLearnWords().getAggregatedWords(userId, filter, wordsPerPage);
    }

    const data: IAggregatedWords[] = await resp.json();
    return { set: data[0].paginatedResults, count: data[0].totalCount[0].count };
  }
}

export default ApiLearnWords;
