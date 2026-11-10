import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../hooks/useChat';
import { useNetworkStatus } from '../ui/OfflineBanner';
import ErrorState from '../ui/ErrorState';
import Skeleton from '../ui/Skeleton';
import { ChatBubbleIcon, SendIcon, TrashIcon, XIcon } from '../ui/Icons';

/**
 * AskChatSheet — Mock Q&A assistant panel.
 * Bottom sheet on mobile (<768px), right side panel on desktop (≥768px).
 */
export default function AskChatSheet({ open, onClose }) {
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const {
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
  } = useChat();

  const scrollEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages, isTyping, streamingMessage]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    ask(input);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/50 flex items-end md:items-stretch md:justify-end animate-fade-in"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('ask_title')}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[82dvh] md:max-h-none md:h-full md:w-[400px] bg-white rounded-t-2xl md:rounded-none border-t md:border-t-0 md:border-l border-border shadow-elevated flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2 bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-[8px] bg-primary-light text-primary flex items-center justify-center shrink-0">
              <ChatBubbleIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-black truncate">{t('ask_title')}</h2>
              <p className="text-[11px] text-muted truncate">{t('ask_subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={clearChat}
              disabled={messages.length === 0 && !streamingMessage && !error}
              aria-label={t('ask_clear')}
              title={t('ask_clear')}
              className="touch-target w-11 h-11 rounded-[6px] text-muted hover:text-black hover:bg-sunken disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('ask_close')}
              title={t('ask_close')}
              className="touch-target w-11 h-11 rounded-[6px] text-muted hover:text-black hover:bg-sunken flex items-center justify-center transition-colors cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Offline alert strip inside chat if offline */}
        {!isOnline && (
          <div className="px-4 py-2 bg-yellow-light border-b border-yellow/30 text-xs font-medium text-black">
            {t('report_offline_saved_title')} — {t('ask_error_desc')}
          </div>
        )}

        {/* Messages & Suggested Questions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Suggested questions shown on first open / when chat is empty */}
          {messages.length === 0 && !isTyping && !streamingMessage && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                {t('ask_suggested_label')}
              </p>
              {loadingSuggestions ? (
                <div className="space-y-2">
                  <Skeleton width="85%" height="36px" rounded="sm" />
                  <Skeleton width="75%" height="36px" rounded="sm" />
                  <Skeleton width="80%" height="36px" rounded="sm" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => ask(item.query)}
                      className="text-left px-3 py-2 rounded-[8px] border border-border bg-sunken hover:border-primary hover:text-primary text-xs font-medium text-black transition-colors cursor-pointer"
                    >
                      {t(item.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Conversation thread */}
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-[8px] text-xs leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-primary text-white font-medium'
                      : 'bg-sunken text-black border border-border'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start" aria-live="polite">
              <div className="px-3.5 py-2.5 rounded-[8px] bg-sunken border border-border inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse [animation-delay:300ms]" />
                <span className="sr-only">{t('ask_typing')}</span>
              </div>
            </div>
          )}

          {/* Progressive streaming reply */}
          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[85%] px-3.5 py-2.5 rounded-[8px] bg-sunken text-black border border-border text-xs leading-relaxed whitespace-pre-line">
                {streamingMessage.text}
              </div>
            </div>
          )}

          {/* Error state if request fails */}
          {error && (
            <div className="pt-2">
              <ErrorState
                title={t('ask_error_title')}
                description={t('ask_error_desc')}
                onRetry={retryLast}
              />
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-border bg-white flex items-center gap-2 shrink-0"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ask_placeholder')}
            aria-label={t('ask_placeholder')}
            className="flex-1 h-11 px-3.5 rounded-[6px] border border-border bg-white text-sm text-black placeholder:text-muted-light focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={t('ask_send')}
            className="touch-target h-11 px-4 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <SendIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t('ask_send')}</span>
          </button>
        </form>
      </aside>
    </div>
  );
}

