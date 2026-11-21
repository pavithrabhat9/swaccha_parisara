import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

export const businessApi = {
  getSubscription: async () => {
    return storageAdapter.get(STORAGE_KEYS.BUSINESS, null);
  },

  createSubscription: async (data) => {
    return storageAdapter.set(STORAGE_KEYS.BUSINESS, data);
  },

  updateSubscription: async (data) => {
    return storageAdapter.set(STORAGE_KEYS.BUSINESS, data);
  },
};
