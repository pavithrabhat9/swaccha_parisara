import React from 'react';
import { cn } from '../../utils/cn';

/**
 * PageTopBar — Reusable mobile-first page header (clean title bar, no back button).
 */
export default function PageTopBar({
  title,
  rightSlot = null,
  as: HeadingTag = 'h1',
  className = '',
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-white/95 glass border-b border-border/80 px-4 sm:px-6 lg:px-8',
        className
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-5xl mx-auto h-14 flex items-center justify-between gap-3">
        <HeadingTag className="text-base sm:text-lg font-extrabold text-ink text-balance truncate">
          {title}
        </HeadingTag>

        {rightSlot && (
          <div className="flex items-center gap-2 shrink-0">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
