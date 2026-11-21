import { delay } from '../utils/asyncUtils';
import { webApiAdapter } from './storageAdapter';

export const AI_PLASTIC_TYPES = ['PET', 'HDPE', 'LDPE', 'PP', 'Other'];

const SAMPLE_PREDICTIONS = [
  { plasticType: 'PET', confidenceLabel: 'High confidence (92% · sample)', estimatedBagId: 'medium' },
  { plasticType: 'HDPE', confidenceLabel: 'High confidence (88% · sample)', estimatedBagId: 'small' },
  { plasticType: 'PP', confidenceLabel: 'Medium confidence (81% · sample)', estimatedBagId: 'medium' },
  { plasticType: 'LDPE', confidenceLabel: 'Medium confidence (76% · sample)', estimatedBagId: 'small' },
];

/**
 * STUB: Mock AI plastic classifier for the Home Pickup flow.
 * Never awards points. Returns a suggested plastic type, confidence label, and estimated bag size.
 */
export const aiApi = {
  analyzePlasticPhoto: async (fileName = '') => {
    if (!webApiAdapter.isOnline()) {
      throw new Error('Offline');
    }
    await delay(650);
    const seed = fileName ? fileName.length : 0;
    const pick = SAMPLE_PREDICTIONS[seed % SAMPLE_PREDICTIONS.length];
    return {
      ...pick,
      pointsAwarded: 0, // AI NEVER awards points
    };
  },
};
