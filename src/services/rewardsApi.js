import {
  REWARDS_BADGES,
  SAMPLE_AREA_RANKS,
  SAMPLE_PLASTIC_TYPE_RANKS,
  SAMPLE_NGO_CAUSES,
  INITIAL_DONATIONS,
} from '../data/mockRewards';
import { delay } from '../utils/asyncUtils';
import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

const readStoredDonations = () => {
  const parsed = storageAdapter.get(STORAGE_KEYS.DONATIONS, null);
  return Array.isArray(parsed) ? parsed : null;
};

const writeStoredDonations = (list) => {
  return storageAdapter.set(STORAGE_KEYS.DONATIONS, list);
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
