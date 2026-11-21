import { mockPickupHistory, mockUserProfile } from '../data/mockPickups';
import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

export const pickupApi = {
  getPickups: async () => {
    const stored = storageAdapter.get(STORAGE_KEYS.PICKUPS, null);
    return Array.isArray(stored) ? stored : [...mockPickupHistory];
  },

  getProfile: async () => {
    const stored = storageAdapter.get(STORAGE_KEYS.PROFILE, null);
    return stored && typeof stored === 'object' ? stored : { ...mockUserProfile };
  },

  savePickups: async (pickups) => {
    return storageAdapter.set(STORAGE_KEYS.PICKUPS, pickups);
  },

  saveProfile: async (profile) => {
    return storageAdapter.set(STORAGE_KEYS.PROFILE, profile);
  },
};
