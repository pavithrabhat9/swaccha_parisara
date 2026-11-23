import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

/**
 * PageTopBar — Reusable mobile-first page header.
 * Supports optional `onBack`, `backAriaLabel`, `subtitle`, and `centeredTitle`.
 * When `onBack` is omitted, renders the clean left-aligned title bar with no back button.
 */
export default function PageTopBar({
  title,
  subtitle = null,
  onBack = null,
  backAriaLabel = '',
  rightSlot = null,
  centeredTitle = false,
  as: HeadingTag = 'h1',
  className = '',
}) {
  const { t } = useTranslation();

  if (centeredTitle) {
    return (
      <header
        className={cn(
          'sticky top-0 z-30 bg-cream/95 glass border-b border-border/80 px-4 sm:px-6 lg:px-8 shrink-0',
          className
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-5xl mx-auto h-14 grid grid-cols-[44px_1fr_44px] items-center gap-2">
          <div className="flex items-center justify-start">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label={backAriaLabel || t('profile_back_aria', { defaultValue: 'Back' })}
                className="touch-target size-11 -ml-2 rounded-xl text-ink hover:bg-sunken flex items-center justify-center shrink-0 cursor-pointer transition-colors duration-150"
              >
                <ArrowLeftIcon className="size-5" />
              </button>
            )}
          </div>

          <div className="min-w-0 text-center leading-tight">
            <HeadingTag className="text-lg sm:text-xl font-extrabold text-ink text-balance truncate">
              {title}
            </HeadingTag>
            {subtitle && (
              <p className="tabular text-xs font-bold text-primary truncate">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            {rightSlot}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-cream/95 glass border-b border-border/80 px-4 sm:px-6 lg:px-8 shrink-0',
        className
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-5xl mx-auto h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backAriaLabel || t('profile_back_aria', { defaultValue: 'Back' })}
              className="touch-target size-11 -ml-2 rounded-xl text-ink hover:bg-sunken flex items-center justify-center shrink-0 cursor-pointer transition-colors duration-150"
            >
              <ArrowLeftIcon className="size-5" />
            </button>
          )}
          <div className="min-w-0 leading-tight">
            <HeadingTag className="text-lg sm:text-xl font-extrabold text-ink text-balance truncate">
              {title}
            </HeadingTag>
            {subtitle && (
              <p className="tabular text-xs font-bold text-primary truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightSlot && (
          <div className="flex items-center gap-2 shrink-0">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
