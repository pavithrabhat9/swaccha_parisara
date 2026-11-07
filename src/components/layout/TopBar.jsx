import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/Icons';
import LanguageMenu from './LanguageMenu';

/**
 * Mobile top bar — fixed at the very top of the viewport (52px) so it never scrolls out of view.
 * Shows brand mark + stylish Swaccha Parisara wordmark + language switcher.
 */
export default function TopBar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const title = t('appTitle');
  const isEnglish = !i18n.language || i18n.language.startsWith('en');

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-[1200] h-[52px] bg-white/95 glass border-t-2 border-t-primary border-b border-b-border px-4 flex items-center justify-between gap-3 shadow-xs"
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 min-w-0 press-scale cursor-pointer text-left"
      >
        <BrandMark className="w-8 h-8 shrink-0 shadow-xs rounded-xl" />
        {isEnglish ? (
          <span className="font-brand text-[19px] font-extrabold tracking-[-0.03em] leading-none truncate">
            <span className="text-black">Swaccha</span>{' '}
            <span className="text-primary">Parisara</span>
          </span>
        ) : (
          <span className="font-brand text-[18px] font-extrabold text-primary tracking-tight leading-none truncate">
            {title}
          </span>
        )}
      </button>

      <LanguageMenu compact />
    </header>
  );
}
