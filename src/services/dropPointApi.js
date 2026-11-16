import { MOCK_DROP_POINTS, MOCK_DROP_OFF_HISTORY } from '../data/mockDropPoints';
import { delay } from '../utils/asyncUtils';

/**
 * Trash-bank drop-off centers.
 * STUB: returns sample data. Swap the bodies for backend calls later; the shapes stay the same.
 */
export const dropPointApi = {
  getDropPoints: async () => {
    await delay(250);
    return MOCK_DROP_POINTS.map(p => ({ ...p }));
  },

  getDropOffHistory: async () => {
    await delay(200);
    return MOCK_DROP_OFF_HISTORY.map(h => ({ ...h }));
  },
};

