import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

export const businessApi = {
  getSubscription: async () => {
    const key = storageAdapter.scopedKey(STORAGE_KEYS.BUSINESS);
    return storageAdapter.get(key, null);
  },

  createSubscription: async (data) => {
    const key = storageAdapter.scopedKey(STORAGE_KEYS.BUSINESS);
    return storageAdapter.set(key, data);
  },

  updateSubscription: async (data) => {
    const key = storageAdapter.scopedKey(STORAGE_KEYS.BUSINESS);
    return storageAdapter.set(key, data);
  },
};
