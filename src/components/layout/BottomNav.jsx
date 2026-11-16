import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon, GiftIcon, UserIcon } from '../ui/Icons';

const NAV_ITEMS = [
  {
    path: '/home',
    labelKey: 'home',
    icon: () => <HomeIcon className="w-[21px] h-[21px]" />,
  },
  {
    path: '/map',
    labelKey: 'map',
    // The Report flow is launched from the Map, so Map stays highlighted while reporting
    alsoActiveOn: ['/report'],
    icon: () => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    path: '/pickup',
    labelKey: 'pickup',
    primary: true, // center tab, raised on mobile as the primary action
    icon: () => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    path: '/rewards',
    labelKey: 'rewards',
    icon: () => <GiftIcon className="w-[21px] h-[21px]" />,
  },
  {
    path: '/profile',
    labelKey: 'profile',
    icon: () => <UserIcon className="w-[21px] h-[21px]" />,
  },
];

const isItemActive = (item, pathname) =>
  pathname === item.path || (item.alsoActiveOn || []).includes(pathname);

/**
 * Single responsive navigation component (5 destinations: Home, Map, Pickup, Rewards, Profile):
 * - Mobile (<768px): fixed full-width white bottom bar, icon + tab name, Pickup raised in the center.
 * - Desktop (≥768px): centered pill dock in the top header (icons only below 1280px so it never
 *   collides with the logo, icon + label from 1280px).
 * Hidden on the Auth screen.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (location.pathname === '/auth') return null;

  return (
    <>
      {/* === DESKTOP NAV DOCK (≥768px) — centered inside the top header === */}
      <nav
        aria-label="Primary"
        className="hidden md:flex fixed top-2.5 left-1/2 -translate-x-1/2 z-[1210] items-center gap-1 bg-white p-1.5 rounded-full shadow-xs"
      >
        {NAV_ITEMS.map(item => {
          const isActive = isItemActive(item, location.pathname);
          const label = t(item.labelKey);

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              aria-label={label}
              title={label}
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
              {item.icon()}
              <span className="hidden xl:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* === MOBILE NAV (<768px) — fixed edge-to-edge white bottom bar === */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[1200] bg-white border-t border-black/8 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-16 px-1 bg-white">
          {NAV_ITEMS.map(item => {
            const isActive = isItemActive(item, location.pathname);
            const label = t(item.labelKey);

            const labelClass = `text-[11px] leading-none tracking-tight ${
              isActive ? 'font-bold text-primary' : 'font-medium text-muted-light'
            }`;

            // Center Pickup tab: slightly raised round button (primary action)
            if (item.primary) {
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex-1 h-full flex flex-col items-center justify-end gap-[3px] pb-1.5 touch-target press-scale cursor-pointer"
                >
                  <span className="w-[52px] h-[52px] rounded-full bg-primary text-white shadow-fab ring-4 ring-white flex items-center justify-center">
                    {item.icon()}
                  </span>
                  <span className={labelClass}>{label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-1
                  touch-target transition-colors duration-200 press-scale cursor-pointer
                  ${isActive ? 'text-primary' : 'text-muted-light hover:text-primary'}
                `}
              >
                {item.icon()}
                <span className={labelClass}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
