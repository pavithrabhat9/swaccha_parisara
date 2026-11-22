import { LEARN_HIGHLIGHTS } from '../data/mockHome';
import { devControls } from './devControls';

/**
 * Learn highlights & quick guides service.
 */
export const learnApi = {
  getHighlights: async () => {
    await devControls.applyServiceSimulation('learn', 120);
    return LEARN_HIGHLIGHTS.map((item) => ({ ...item }));
  },
};

