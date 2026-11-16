import {
  REWARDS_BADGES,
  SAMPLE_AREA_RANKS,
  SAMPLE_PLASTIC_TYPE_RANKS,
  SAMPLE_NGO_CAUSES,
  INITIAL_DONATIONS,
} from '../data/mockRewards';
import { delay } from '../utils/asyncUtils';

const DONATIONS_STORAGE_KEY = 'swachha_donations';

const readStoredDonations = () => {
  try {
    const raw = localStorage.getItem(DONATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return null;
};

const writeStoredDonations = (list) => {
  try {
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
  return list;
};

/**
 * STUB: Async mock service for Rewards data and point donations.
 */
export const rewardsApi = {
  getRewardsData: async () => {
    await delay(220);
    const donations = readStoredDonations() || [...INITIAL_DONATIONS];
    return {
      badges: [...REWARDS_BADGES],
      areaRanks: SAMPLE_AREA_RANKS.map(r => ({ ...r })),
      plasticTypeRanks: SAMPLE_PLASTIC_TYPE_RANKS.map(r => ({ ...r })),
      causes: [...SAMPLE_NGO_CAUSES],
      donations,
    };
  },

  saveDonation: async (donation) => {
    await delay(200);
    const current = readStoredDonations() || [...INITIAL_DONATIONS];
    const next = [donation, ...current];
    return writeStoredDonations(next);
  },
};

