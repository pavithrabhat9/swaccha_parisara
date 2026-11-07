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
 * Single responsive navigation component (icons only — all 4 items styled uniformly):
 * - Mobile (<768px): fixed floating rounded bottom bar with active green pill for whichever tab is active.
 * - Desktop (≥768px): slim top bar with stylish brand wordmark on left, uniform icon dock centered, language menu on right.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const title = t('appTitle');
  const isEnglish = !i18n.language || i18n.language.startsWith('en');

  return (
    <>
      {/* === DESKTOP NAV (≥768px) — slim top bar === */}
      <nav
        aria-label="Primary"
        className="hidden md:flex fixed top-0 left-0 right-0 z-[1200] bg-white/95 glass border-t-2 border-t-primary border-b border-b-border h-16 px-6 items-center justify-between shadow-xs"
      >
        {/* Brand Logo + Stylish Wordmark (no subtitle) */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3 press-scale cursor-pointer text-left"
        >
          <BrandMark className="w-9 h-9 shadow-xs rounded-xl" />
          {isEnglish ? (
            <span className="font-brand text-[21px] font-extrabold tracking-[-0.03em] leading-none">
              <span className="text-black">Swaccha</span>{' '}
              <span className="text-primary">Parisara</span>
            </span>
          ) : (
            <span className="font-brand text-xl font-extrabold text-primary tracking-tight leading-none">
              {title}
            </span>
          )}
        </button>

        {/* Center Icon-Only Dock — all 4 tabs treated uniformly */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-sunken p-1.5 rounded-full border border-border">
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
                  group relative touch-target h-10 px-4 rounded-full flex items-center justify-center
                  transition-all duration-200 press-scale cursor-pointer
                  ${isActive
                    ? 'bg-primary text-white shadow-pill'
                    : 'text-muted hover:text-primary hover:bg-white'
                  }
                `}
              >
                {item.icon(isActive)}
                <span
                  role="tooltip"
                  className="nav-tooltip px-2.5 py-1 rounded-lg bg-primary-dark text-white text-[11px] font-semibold shadow-elevated z-50"
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right actions: Language switcher — stays in exact same place */}
        <div className="flex items-center gap-2">
          <LanguageMenu />
        </div>
      </nav>

      {/* === MOBILE NAV (<768px) — floating rounded icon-only bottom bar (all 4 tabs uniform) === */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[1200] pointer-events-none px-3 pb-2.5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      >
        <nav
          aria-label="Primary"
          className="pointer-events-auto w-full max-w-sm mx-auto bg-white/95 glass rounded-full shadow-nav border border-border px-2.5 h-15 flex items-center justify-around"
        >
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
                  touch-target h-11 px-4 rounded-full flex items-center justify-center
                  transition-all duration-200 press-scale cursor-pointer
                  ${isActive
                    ? 'bg-primary text-white shadow-pill'
                    : 'text-muted hover:text-primary'
                  }
                `}
              >
                {item.icon(isActive)}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
