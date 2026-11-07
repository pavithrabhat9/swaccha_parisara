const STORAGE_KEY = 'swachha_business';

export const businessApi = {
  getSubscription: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },
  
  createSubscription: async (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },
  
  updateSubscription: async (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
};
