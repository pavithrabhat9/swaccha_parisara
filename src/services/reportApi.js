import { initialMockReports } from '../data/mockReports';
import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

export const reportApi = {
  getReports: async () => {
    const stored = storageAdapter.get(STORAGE_KEYS.REPORTS, null);
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
    return [...initialMockReports];
  },

  saveReports: async (reports) => {
    return storageAdapter.set(STORAGE_KEYS.REPORTS, reports);
  },
};
