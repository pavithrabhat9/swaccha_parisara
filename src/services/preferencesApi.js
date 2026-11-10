const PREFS_STORAGE_KEY = 'swachha_notification_prefs';

const DEFAULT_PREFERENCES = {
  pickupUpdates: true,
  reportStatus: true,
  ngoNews: false,
};

export const preferencesApi = {
  getPreferences: async () => {
    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
      }
    } catch {
      // ignore storage read errors
    }
    return { ...DEFAULT_PREFERENCES };
  },

  savePreferences: async (prefs) => {
    const merged = { ...DEFAULT_PREFERENCES, ...prefs };
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage write errors
    }
    return merged;
  },
};

