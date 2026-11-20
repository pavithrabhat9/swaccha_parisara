import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon, GiftIcon, UserIcon, ScanFrameIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  {
    path: '/home',
    labelKey: 'home',
    icon: () => <HomeIcon className="size-[22px]" />,
  },
  {
    path: '/map',
    labelKey: 'map',
    alsoActiveOn: ['/report'],
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    path: '/pickup',
    labelKey: 'pickup',
    primary: true,
    icon: () => <ScanFrameIcon className="size-[26px]" />,
  },
  {
    path: '/rewards',
    labelKey: 'rewards',
    icon: () => <GiftIcon className="size-[22px]" />,
  },
  {
    path: '/profile',
    labelKey: 'profile',
    icon: () => <UserIcon className="size-[22px]" />,
  },
];

const isItemActive = (item, pathname) =>
  pathname === item.path || (item.alsoActiveOn || []).includes(pathname);

/**
 * Single responsive navigation component (5 destinations: Home, Map, Pickup, Rewards, Profile):
 * - Mobile (<768px): full-width primary green (#38761d) bar with a constant-geometry curved center notch
 *   and a raised white circular Pickup button (scan-frame icon).
 * - Desktop (≥768px): centered pill dock in the top header.
 * Hidden on the Auth screen.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (location.pathname === '/auth') return null;

  const leftItems = NAV_ITEMS.slice(0, 2);
  const centerItem = NAV_ITEMS[2];
  const rightItems = NAV_ITEMS.slice(3, 5);
  const centerActive = isItemActive(centerItem, location.pathname);
  const centerLabel = t(centerItem.labelKey);

  const renderSideTab = (item) => {
    const isActive = isItemActive(item, location.pathname);
    const label = t(item.labelKey);

    return (
      <button
        key={item.path}
        type="button"
        onClick={() => navigate(item.path)}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        className="flex-1 h-full min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1 text-white cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow rounded-lg"
      >
        <span
          className={cn(
            'transition-[transform,opacity] duration-150 ease-out',
            isActive ? 'opacity-100 scale-105' : 'opacity-75 hover:opacity-95 scale-100'
          )}
        >
          {item.icon()}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'size-1.5 rounded-full bg-white transition-[transform,opacity] duration-150 ease-out',
            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          )}
        />
      </button>
    );
  };

  return (
    <>
      {/* === DESKTOP NAV DOCK (≥768px) — centered inside the top header === */}
      <nav
        aria-label="Primary"
        className="hidden md:flex fixed top-2.5 left-1/2 -translate-x-1/2 z-40 items-center gap-1 bg-white p-1.5 rounded-full border border-border"
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
              className={cn(
                'touch-target h-10 px-4 rounded-full flex items-center justify-center gap-2',
                'text-caption font-semibold transition-colors duration-150 press-scale cursor-pointer',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-primary hover:bg-primary-lighter'
              )}
            >
              {item.icon()}
              <span className="hidden xl:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* === MOBILE NAV (<768px) — green curved-notch bar with raised center Pickup button === */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none select-none"
      >
        <div className="relative w-full pointer-events-auto">
          {/* Raised circular center Pickup button — sits in the curved notch */}
          <button
            type="button"
            onClick={() => navigate(centerItem.path)}
            aria-label={centerLabel}
            aria-current={centerActive ? 'page' : undefined}
            className={cn(
              'absolute left-1/2 -translate-x-1/2 -top-[28px] z-20',
              'size-[62px] rounded-full bg-white text-primary',
              'flex items-center justify-center cursor-pointer',
              'transition-transform duration-150 ease-out active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow',
              centerActive
                ? 'border-[3px] border-primary shadow-fab scale-[1.03]'
                : 'border-2 border-primary shadow-card'
            )}
          >
            {centerItem.icon()}
          </button>

          {/* Bar background: stretching left/right green wings + fixed-width SVG notch in the center */}
          <div
            aria-hidden="true"
            className="flex items-stretch w-full h-16 drop-shadow-[0_-4px_14px_rgba(16,24,12,0.12)]"
          >
            <div className="flex-1 bg-primary rounded-tl-[18px]" />
            <svg
              className="w-[136px] h-16 shrink-0 -mx-px block"
              viewBox="0 0 136 64"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0C22 0 28 38 68 38C108 38 114 0 136 0V64H0V0Z"
                fill="#38761d"
              />
            </svg>
            <div className="flex-1 bg-primary rounded-tr-[18px]" />
          </div>

          {/* Interactive icon row overlaid on the 64px bar */}
          <div className="absolute inset-x-0 top-0 h-16 z-10 flex items-center">
            <div className="flex-1 h-full flex items-center justify-around pl-2 pr-1">
              {leftItems.map(renderSideTab)}
            </div>

            {/* Center notch spacer (matches the 136px notch width) */}
            <div className="w-[112px] shrink-0 pointer-events-none" aria-hidden="true" />

            <div className="flex-1 h-full flex items-center justify-around pl-1 pr-2">
              {rightItems.map(renderSideTab)}
            </div>
          </div>

          {/* Solid green safe-area fill under the gesture bar */}
          <div
            aria-hidden="true"
            className="w-full bg-primary"
            style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
          />
        </div>
      </nav>
    </>
  );
}
