import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BrandMark,
  ChatBubbleIcon,
  HomeIcon,
  MapPinIcon,
  ScanFrameIcon,
  GiftIcon,
  UserIcon,
} from '../ui/Icons';
import LanguageMenu from './LanguageMenu';
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
 * TopBar — Clean, tactile consumer app header.
 * Frosted white surface, warm emerald BrandMark, soft pill desktop navigation, Ask & Language controls.
 */
export default function TopBar({ onOpenAsk }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const hideNav = location.pathname === '/auth';

  return (
    <header className="sticky top-0 z-40 h-15 bg-white/92 glass shadow-xs px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
      {/* Left: Brand Emblem + Wordmark */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 shrink-0 press-scale cursor-pointer text-left"
      >
        <BrandMark className="size-9 shrink-0 rounded-xl shadow-xs" />
        <span className="font-brand text-base sm:text-[17px] font-extrabold text-ink tracking-tight whitespace-nowrap">
          {t('appTitle')}
        </span>
      </button>

      {/* Center: Desktop Primary Navigation */}
      {!hideNav && (
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = isItemActive(item, location.pathname);
            const label = t(item.labelKey);
            const Icon = item.Icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'h-10 px-4 rounded-xl inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-150 cursor-pointer',
                  active
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-muted hover:text-ink hover:bg-sunken/80'
                )}
              >
                <Icon className={cn('size-4', active ? 'text-primary' : 'text-muted')} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Right: Ask Assistant + Language Switch */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenAsk}
          aria-label={t('ask')}
          className="touch-target h-9 px-3.5 rounded-xl bg-primary-light hover:bg-primary/15 text-primary-dark text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer press-scale"
        >
          <ChatBubbleIcon className="size-3.5 text-primary shrink-0" />
          <span>{t('ask')}</span>
        </button>

        <LanguageMenu compact />
      </div>
    </header>
  );
}
