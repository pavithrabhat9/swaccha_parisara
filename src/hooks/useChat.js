import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../services/chatApi';

// Session-only in-memory store (persists across drawer open/close & route changes, resets on page reload)
let sessionMessagesStore = [];

/**
 * Custom hook for the Ask Chatbot.
 * Handles suggested questions, typing state, progressive streaming reply, and session-memory persistence.
 */
export function useChat() {
  const [messages, setMessages] = useState(() => [...sessionMessagesStore]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [error, setError] = useState(null);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);

  const streamTimerRef = useRef(null);

  // Sync messages to session memory
  const updateMessages = useCallback((updater) => {
    setMessages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      sessionMessagesStore = [...next];
      return next;
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    chatApi.getSuggestedQuestions()
      .then(items => {
        if (mounted) {
          setSuggestedQuestions(items);
          setLoadingSuggestions(false);
        }
      })
      .catch(() => {
        if (mounted) setLoadingSuggestions(false);
      });

    return () => {
      mounted = false;
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const ask = useCallback(async (rawText) => {
    const trimmed = (rawText ?? input).trim();
    if (!trimmed || isTyping || streamingMessage) return;

    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    updateMessages(prev => [...prev, userMsg]);
    setInput('');
    setError(null);
    setLastFailedQuery(null);
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage(trimmed);
      setIsTyping(false);

      // Progressive streaming effect (word-by-word)
      const tokens = response.text.split(/(\s+)/);
      let index = 0;

      setStreamingMessage({
        id: response.id,
        role: 'assistant',
        text: '',
      });

      streamTimerRef.current = setInterval(() => {
        index += 2; // word + whitespace
        const partial = tokens.slice(0, index).join('');
        if (index >= tokens.length) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
          setStreamingMessage(null);
          updateMessages(prev => [...prev, response]);
        } else {
          setStreamingMessage({
            id: response.id,
            role: 'assistant',
            text: partial,
          });
        }
      }, 24);
    } catch (err) {
      setIsTyping(false);
      setStreamingMessage(null);
      setLastFailedQuery(trimmed);
      setError(err?.message || 'Request failed');
    }
  }, [input, isTyping, streamingMessage, updateMessages]);

  const retryLast = useCallback(() => {
    if (!lastFailedQuery) return;
    // Remove last user message before re-sending so it isn't duplicated
    updateMessages(prev => prev.slice(0, -1));
    ask(lastFailedQuery);
  }, [lastFailedQuery, updateMessages, ask]);

  const clearChat = useCallback(() => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsTyping(false);
    setStreamingMessage(null);
    setError(null);
    setLastFailedQuery(null);
    updateMessages([]);
  }, [updateMessages]);

  const canSend = Boolean(input.trim()) && !isTyping && !streamingMessage;

  return {
    messages,
    suggestedQuestions,
    loadingSuggestions,
    input,
    setInput,
    isTyping,
    streamingMessage,
    error,
    canSend,
    ask,
    retryLast,
    clearChat,
  };
}

