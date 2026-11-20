import React from 'react';
import { useTranslation } from 'react-i18next';
import { PICKUP_STATUS_STEPS, STATUS_LABEL_KEYS, getStatusStepIndex } from '../../utils/pickupStatusUtils';
import { cn } from '../../utils/cn';

/** Small 4-step timeline: Requested, Scheduled, On the way, Completed. */
export default function PickupStatusTimeline({ status }) {
  const { t } = useTranslation();
  const currentIndex = getStatusStepIndex(status);

  return (
    <ol className="flex items-start pt-1" aria-label={t('home_view_status')}>
      {PICKUP_STATUS_STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <li
            key={step}
            aria-current={current ? 'step' : undefined}
            className="relative flex-1 min-w-0 flex flex-col items-center gap-1.5"
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cn('absolute top-[7px] right-1/2 w-full h-0.5', reached ? 'bg-primary' : 'bg-border')}
              />
            )}
            <span
              className={cn(
                'relative z-10 size-4 rounded-full border-2',
                reached ? 'bg-primary border-primary' : 'bg-white border-border',
                current && 'ring-4 ring-primary/20'
              )}
            />
            <span
              className={cn(
                'text-[11px] leading-tight text-center',
                current ? 'font-bold text-ink' : 'text-muted'
              )}
            >
              {t(STATUS_LABEL_KEYS[step])}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
