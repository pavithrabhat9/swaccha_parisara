import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/Icons';
import LanguageMenu from './LanguageMenu';

const NAV_ITEMS = [
  {
    path: '/',
    labelKey: 'map',
    icon: () => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    path: '/report',
    labelKey: 'report',
    icon: () => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    path: '/pickup',
    labelKey: 'pickup',
    icon: () => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    path: '/learn',
    labelKey: 'learn',
    icon: () => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

/**
 * Single responsive navigation component (all 4 items styled uniformly):
 * - Mobile (<768px): fixed full-width pure-white bottom bar with icon + tab name.
 * - Desktop (≥768px): slim green top bar with white wordmark on left, uniform nav dock centered, language menu on right.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const title = t('appTitle');
  const isEnglish = !i18n.language || i18n.language.startsWith('en');

  return (
    <>
      {/* === DESKTOP NAV (≥768px) — slim green top bar === */}
      <nav
        aria-label="Primary"
        className="hidden md:flex fixed top-0 left-0 right-0 z-[1200] bg-primary h-16 px-6 items-center justify-between shadow-sm"
      >
        {/* Brand Logo + Stylish Wordmark (inverted on green header) */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3 press-scale cursor-pointer text-left"
        >
          <BrandMark inverted className="w-9 h-9 shadow-xs rounded-xl" />
          {isEnglish ? (
            <span className="font-brand text-[21px] font-extrabold tracking-[-0.03em] leading-none text-white">
              Swaccha Parisara
            </span>
          ) : (
            <span className="font-brand text-xl font-extrabold text-white tracking-tight leading-none">
              {title}
            </span>
          )}
        </button>

        {/* Center Nav Dock — all 4 tabs treated uniformly */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white p-1.5 rounded-full shadow-xs">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const label = t(item.labelKey);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  touch-target h-10 px-4 rounded-full flex items-center justify-center gap-2
                  text-caption font-semibold transition-all duration-200 press-scale cursor-pointer
                  ${isActive
                    ? 'bg-primary text-white shadow-pill'
                    : 'text-muted hover:text-primary hover:bg-primary-lighter'
                  }
                `}
              >
                {item.icon(isActive)}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Right actions: Language switcher — stays in exact same place */}
        <div className="flex items-center gap-2">
          <LanguageMenu />
        </div>
      </nav>

      {/* === MOBILE NAV (<768px) — fixed edge-to-edge white bottom bar with icons + tab names === */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[1200] bg-white border-t border-black/8 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-16 px-1 bg-white">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const label = t(item.labelKey);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-2
                  touch-target transition-colors duration-200 press-scale cursor-pointer
                  ${isActive
                    ? 'text-primary'
                    : 'text-muted-light hover:text-primary'
                  }
                `}
              >
                {item.icon(isActive)}
                <span
                  className={`text-[11px] leading-none tracking-tight ${
                    isActive ? 'font-bold text-primary' : 'font-medium text-muted-light'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
