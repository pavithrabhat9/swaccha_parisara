import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

const DEFAULT_PREFERENCES = {
  pickupUpdates: true,
  reportStatus: true,
  ngoNews: false,
};

export const preferencesApi = {
  getPreferences: async () => {
    const key = storageAdapter.scopedKey(STORAGE_KEYS.NOTIFICATION_PREFS);
    const stored = storageAdapter.get(key, null);
    if (stored && typeof stored === 'object') {
      return { ...DEFAULT_PREFERENCES, ...stored };
    }
    return { ...DEFAULT_PREFERENCES };
  },

  savePreferences: async (prefs) => {
    const key = storageAdapter.scopedKey(STORAGE_KEYS.NOTIFICATION_PREFS);
    const merged = { ...DEFAULT_PREFERENCES, ...prefs };
    return storageAdapter.set(key, merged);
  },
};
