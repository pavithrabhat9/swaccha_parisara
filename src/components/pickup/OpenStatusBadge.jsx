import React from 'react';
import { useTranslation } from 'react-i18next';
import { getOpenStatus } from '../../utils/dropPointUtils';
import { cn } from '../../utils/cn';

/** Open / Closed pill for a drop point, with the closing or next-opening time. */
export default function OpenStatusBadge({ point, showTime = true }) {
  const { t } = useTranslation();
  const { isOpen, time } = getOpenStatus(point);

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
          isOpen
            ? 'bg-primary-light text-primary-dark border-primary/25'
            : 'bg-sunken text-muted border-border'
        )}
      >
        {isOpen ? t('open_now') : t('closed_now')}
      </span>
      {showTime && (
        <span className="text-[11px] text-muted tabular">
          {isOpen ? t('closes_at', { time }) : t('opens_at', { time })}
        </span>
      )}
    </span>
  );
}
