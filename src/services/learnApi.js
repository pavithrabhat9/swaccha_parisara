import { LEARN_HIGHLIGHTS } from '../data/mockHome';
import { PLASTIC_TYPES_GUIDE } from '../data/plasticTypesGuide';
import { devControls } from './devControls';

/**
 * Learn highlights, quick guides & "Know Your Plastic" article service.
 */
export const learnApi = {
  getHighlights: async () => {
    await devControls.applyServiceSimulation('learn', 120);
    return LEARN_HIGHLIGHTS.map((item) => ({ ...item }));
  },

  getPlasticTypesGuide: async () => {
    await devControls.applyServiceSimulation('learn', 140);
    return {
      ...PLASTIC_TYPES_GUIDE,
      introParagraphs: [...PLASTIC_TYPES_GUIDE.introParagraphs],
      backgroundSection: { ...PLASTIC_TYPES_GUIDE.backgroundSection },
      types: PLASTIC_TYPES_GUIDE.types.map((item) => ({
        ...item,
        examples: [...item.examples],
      })),
      finalConsiderations: {
        ...PLASTIC_TYPES_GUIDE.finalConsiderations,
        points: PLASTIC_TYPES_GUIDE.finalConsiderations.points.map((pt) => ({ ...pt })),
      },
      relatedGuides: PLASTIC_TYPES_GUIDE.relatedGuides.map((g) => ({ ...g })),
    };
  },
};

