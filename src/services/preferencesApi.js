import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

const DEFAULT_PREFERENCES = {
  pickupUpdates: true,
  reportStatus: true,
  ngoNews: false,
};

export const preferencesApi = {
  getPreferences: async () => {
    const stored = storageAdapter.get(STORAGE_KEYS.NOTIFICATION_PREFS, null);
    if (stored && typeof stored === 'object') {
      return { ...DEFAULT_PREFERENCES, ...stored };
    }
    return { ...DEFAULT_PREFERENCES };
  },

  savePreferences: async (prefs) => {
    const merged = { ...DEFAULT_PREFERENCES, ...prefs };
    return storageAdapter.set(STORAGE_KEYS.NOTIFICATION_PREFS, merged);
  },
};
