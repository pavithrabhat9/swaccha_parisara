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

  getReportById: async (reportId) => {
    if (!reportId) return null;
    const list = await reportApi.getReports();
    return list.find((r) => r.id === reportId) || null;
  },

  saveReports: async (reports) => {
    const userKey = storageAdapter.getCurrentUserKey();
    const stamped = Array.isArray(reports)
      ? reports.map((r) =>
          r && String(r.id).startsWith('RP-') && !r.userKey ? { ...r, userKey } : r
        )
      : reports;
    return storageAdapter.set(STORAGE_KEYS.REPORTS, stamped);
  },
};
