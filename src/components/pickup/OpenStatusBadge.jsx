import React from 'react';
import { useTranslation } from 'react-i18next';
import { getOpenStatus } from '../../utils/dropPointUtils';
import { cn } from '../../utils/cn';

/** Open / Closed facility status tag with operating hours readout (no fake dots). */
export default function OpenStatusBadge({ point, showTime = true }) {
  const { t } = useTranslation();
  const { isOpen, time } = getOpenStatus(point);

  return (
    <span className="inline-flex items-center gap-2 flex-wrap">
      <span
        className={cn(
          'inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-bold',
          isOpen
            ? 'bg-primary-light text-primary-dark'
            : 'bg-sunken text-muted'
        )}
      >
        {isOpen ? t('open_now') : t('closed_now')}
      </span>
      {showTime && (
        <span className="tabular text-xs text-muted font-medium">
          {isOpen ? t('closes_at', { time }) : t('opens_at', { time })}
        </span>
      )}
    </span>
  );
}
