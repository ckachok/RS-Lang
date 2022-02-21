const STORAGE_USER_KEYS = ['userName', 'authToken', 'authRefreshToken', 'userId'];

export const saveUserData = (userAuthData: { [type: string]: string }): void => {
  STORAGE_USER_KEYS.forEach(key => localStorage.setItem(key, userAuthData[key]));
};

export const deleteUserData = (): void => {
  STORAGE_USER_KEYS.forEach(key => localStorage.removeItem(key));
};
