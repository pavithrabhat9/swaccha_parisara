import { mockPickupHistory, mockUserProfile } from '../data/mockPickups';

const PICKUP_STORAGE_KEY = 'swachha_pickups';
const PROFILE_STORAGE_KEY = 'swachha_profile';

export const pickupApi = {
  getPickups: async () => {
    try {
      const stored = localStorage.getItem(PICKUP_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [...mockPickupHistory];
  },

  getProfile: async () => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return { ...mockUserProfile };
  },

  savePickups: async (pickups) => {
    localStorage.setItem(PICKUP_STORAGE_KEY, JSON.stringify(pickups));
    return pickups;
  },

  saveProfile: async (profile) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  }
};
