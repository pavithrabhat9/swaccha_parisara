import { SUGGESTED_QUESTION_ITEMS, matchQuestionToAnswer } from '../utils/chatMatcher';

/**
 * Mock async chat service.
 * Designed so a real backend endpoint can replace these functions later without touching UI or hooks.
 */
export const chatApi = {
  getSuggestedQuestions: async () => {
    await new Promise(resolve => setTimeout(resolve, 120));
    return [...SUGGESTED_QUESTION_ITEMS];
  },

  sendMessage: async (questionText) => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('Offline');
    }
    await new Promise(resolve => setTimeout(resolve, 420));
    const reply = matchQuestionToAnswer(questionText);
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'assistant',
      text: reply,
      createdAt: new Date().toISOString(),
    };
  },
};

