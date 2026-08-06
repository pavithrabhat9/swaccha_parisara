import { initialMockReports } from '../data/mockReports';

const STORAGE_KEY = 'swachha_reports';

export const reportApi = {
  getReports: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [...initialMockReports];
  },

  saveReports: async (reports) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch { /* ignore */ }
    return reports;
  }
};
