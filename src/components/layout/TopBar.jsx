import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandMark, ChatBubbleIcon } from '../ui/Icons';
import LanguageMenu from './LanguageMenu';

/**
 * Shared header component across all screens (mobile and desktop).
 * - Left: Logo + app name (never truncated at 360px width).
 * - Right: Ask button (icon-only on mobile with 44px target, icon + "Ask" on desktop), then LanguageMenu.
 */
export default function TopBar({ onOpenAsk }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const title = t('appTitle');
  const isEnglish = !i18n.language || i18n.language.startsWith('en');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1200] h-[52px] md:h-16 bg-primary px-2.5 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-3 shadow-sm"
    >
      {/* Left: Brand Logo + App Name (never truncated even at 360px width) */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 md:gap-3 shrink-0 press-scale cursor-pointer text-left"
      >
        <BrandMark inverted className="w-8 h-8 md:w-9 md:h-9 shrink-0 shadow-xs rounded-xl" />
        {isEnglish ? (
          <span className="font-brand text-[18px] sm:text-[19px] md:text-[21px] font-extrabold tracking-[-0.03em] leading-none text-white whitespace-nowrap">
            Swaccha Parisara
          </span>
        ) : (
          <span className="font-brand text-[17px] sm:text-[18px] md:text-xl font-extrabold text-white tracking-tight leading-none whitespace-nowrap">
            {title}
          </span>
        )}
      </button>

      {/* Right: Ask button + Language selector (nothing else) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenAsk}
          aria-label="Ask"
          className="touch-target h-11 px-2.5 md:px-3.5 rounded-lg text-white font-semibold hover:bg-white/15 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChatBubbleIcon className="w-4 h-4 text-white shrink-0" />
          <span className="hidden md:inline text-caption text-white font-semibold">
            {t('ask')}
          </span>
        </button>

        <LanguageMenu compact />
      </div>
    </header>
  );
}
