import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon, MapPinIcon, ScanFrameIcon, GiftIcon, UserIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { path: '/home', labelKey: 'home', Icon: HomeIcon },
  { path: '/map', labelKey: 'map', alsoActiveOn: ['/report'], Icon: MapPinIcon },
  { path: '/pickup', labelKey: 'pickup', Icon: ScanFrameIcon },
  { path: '/rewards', labelKey: 'rewards', Icon: GiftIcon },
  { path: '/profile', labelKey: 'profile', Icon: UserIcon },
];

const isItemActive = (item, pathname) =>
  pathname === item.path || (item.alsoActiveOn || []).includes(pathname);

/**
 * BottomNav — Warm, tactile consumer mobile tab bar (<768px).
 * Frosted white dock with soft ambient lift and emerald active icon capsule.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (location.pathname === '/auth') return null;

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white shadow-nav select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 h-16 px-1">
        {NAV_ITEMS.map(item => {
          const active = isItemActive(item, location.pathname);
          const label = t(item.labelKey);
          const Icon = item.Icon;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'h-full min-h-11 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors duration-150 press-scale',
                active ? 'text-primary' : 'text-muted hover:text-ink'
              )}
            >
              <span
                className={cn(
                  'w-12 h-7 rounded-xl flex items-center justify-center transition-colors duration-150',
                  active ? 'bg-primary-light text-primary' : 'bg-transparent'
                )}
              >
                <Icon className="size-[19px]" />
              </span>
              <span
                className={cn(
                  'text-[11px] leading-none truncate max-w-full px-1',
                  active ? 'font-bold text-primary-dark' : 'font-medium text-muted'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
