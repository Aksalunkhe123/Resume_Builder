const TOKEN_KEY = 'skillbridge_token';
const USER_KEY = 'skillbridge_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

export const clearAuthStorage = () => {
  removeToken();
  removeStoredUser();
};
