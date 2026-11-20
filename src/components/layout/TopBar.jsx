import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandMark, ChatBubbleIcon } from '../ui/Icons';
import LanguageMenu from './LanguageMenu';

/**
 * Shared header component across screens.
 * - Left: Logo + app name.
 * - Right: Ask button (44px target), then LanguageMenu.
 */
export default function TopBar({ onOpenAsk }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const title = t('appTitle');
  const isEnglish = !i18n.language || i18n.language.startsWith('en');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 md:h-16 bg-primary px-2.5 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-3">
      {/* Left: Brand Logo + App Name */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 md:gap-3 shrink-0 press-scale cursor-pointer text-left"
      >
        <BrandMark inverted className="size-8 md:size-9 shrink-0 rounded-xl" />
        {isEnglish ? (
          <span className="font-brand text-lg sm:text-xl font-extrabold leading-none text-white whitespace-nowrap">
            Swaccha Parisara
          </span>
        ) : (
          <span className="font-brand text-lg sm:text-xl font-extrabold text-white leading-none whitespace-nowrap">
            {title}
          </span>
        )}
      </button>

      {/* Right: Ask button + Language selector */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenAsk}
          aria-label={t('ask')}
          className="touch-target h-11 px-2.5 md:px-3.5 rounded-xl text-white font-semibold hover:bg-white/15 inline-flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
        >
          <ChatBubbleIcon className="size-4 text-white shrink-0" />
          <span className="hidden md:inline text-caption text-white font-semibold">
            {t('ask')}
          </span>
        </button>

        <LanguageMenu compact />
      </div>
    </header>
  );
}
