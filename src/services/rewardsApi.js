import {
  REWARDS_BADGES,
  SAMPLE_AREA_RANKS,
  SAMPLE_PLASTIC_TYPE_RANKS,
  SAMPLE_NGO_CAUSES,
  INITIAL_DONATIONS,
} from '../data/mockRewards';
import { storageAdapter, STORAGE_KEYS, DEMO_USER_KEY } from './storageAdapter';
import { pickupApi } from './pickupApi';
import { devControls } from './devControls';

const readStoredDonations = () => {
  const userKey = storageAdapter.getCurrentUserKey();
  const scopedKey = storageAdapter.scopedKey(STORAGE_KEYS.DONATIONS);
  const parsed = storageAdapter.get(scopedKey, null);
  if (Array.isArray(parsed)) return parsed;

  if (userKey === DEMO_USER_KEY) {
    const legacy = storageAdapter.get(STORAGE_KEYS.DONATIONS, null);
    if (Array.isArray(legacy)) {
      storageAdapter.set(scopedKey, legacy);
      return legacy;
    }
    const seeded = [...INITIAL_DONATIONS];
    storageAdapter.set(scopedKey, seeded);
    return seeded;
  }

  return [];
};

const writeStoredDonations = (list) => {
  const scopedKey = storageAdapter.scopedKey(STORAGE_KEYS.DONATIONS);
  return storageAdapter.set(scopedKey, list);
};

/**
 * Single source of truth for Rewards points, badges, ranks, and NGO donations.
 * Points are always derived from completed, weighed pickups minus NGO donations.
 * Pending pickups are never counted in the active points balance.
 */
export const rewardsApi = {
  getBalance: async () => {
    await devControls.applyServiceSimulation('rewards', 100);
    const pickups = await pickupApi.getPickups();
    const donations = readStoredDonations();

    const totalEarned = pickups
      .filter((p) => p && p.status === 'Completed' && Number(p.pointsEarned) > 0)
      .reduce((sum, p) => sum + Number(p.pointsEarned), 0);

    const totalDonated = donations.reduce((sum, d) => sum + (Number(d?.points) || 0), 0);
    const points = Math.max(0, totalEarned - totalDonated);

    return {
      points,
      totalEarned,
      totalDonated,
    };
  },

  getRewardsData: async () => {
    await devControls.applyServiceSimulation('rewards', 180);
    const [balance, donations] = await Promise.all([
      rewardsApi.getBalance(),
      Promise.resolve(readStoredDonations()),
    ]);
    return {
      points: balance.points,
      badges: [...REWARDS_BADGES],
      areaRanks: SAMPLE_AREA_RANKS.map((r) => ({ ...r })),
      plasticTypeRanks: SAMPLE_PLASTIC_TYPE_RANKS.map((r) => ({ ...r })),
      causes: [...SAMPLE_NGO_CAUSES],
      donations,
    };
  },

  saveDonation: async (donation) => {
    await devControls.applyServiceSimulation('rewards', 160);
    const current = readStoredDonations();
    const next = [donation, ...current];
    return writeStoredDonations(next);
  },
};
