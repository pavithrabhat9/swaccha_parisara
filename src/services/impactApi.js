import { delay } from '../utils/asyncUtils';

/**
 * Community impact figures.
 * STUB: sample numbers. Replace with an aggregate query from the backend later.
 */
export const impactApi = {
  getCommunityImpact: async () => {
    await delay(250);
    return { communityKgThisMonth: 1840, isSample: true };
  },
};

