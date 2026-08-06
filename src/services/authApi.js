const AUTH_STORAGE_KEY = 'swachha_auth';

export const authApi = {
  getUser: async () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },

  saveUser: async (user) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  removeUser: async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
