const ONBOARDING_STORAGE_KEY = 'swachha_onboarding_seen';

/**
 * Remembers whether the first-launch onboarding has been shown.
 * Async on purpose so a real backend / device settings store can replace it later.
 */
export const onboardingApi = {
  hasSeen: async () => {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  },

  markSeen: async () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
    } catch { /* ignore storage errors */ }
  },
};

