import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

/**
 * Remembers whether the first-launch onboarding has been shown.
 * Async on purpose so a real backend / device settings store can replace it later.
 */
export const onboardingApi = {
  hasSeen: async () => {
    return storageAdapter.getRaw(STORAGE_KEYS.ONBOARDING_SEEN) === '1';
  },

  markSeen: async () => {
    storageAdapter.setRaw(STORAGE_KEYS.ONBOARDING_SEEN, '1');
  },
};
