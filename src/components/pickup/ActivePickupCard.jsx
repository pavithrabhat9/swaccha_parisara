import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPinIcon } from '../ui/Icons';
import { getBagDetails } from '../../utils/pickupUtils';
import { PICKUP_STATUS_STEPS, STATUS_LABEL_KEYS, getStatusStepIndex } from '../../utils/pickupStatusUtils';
import { formatShortDate } from '../../utils/dateUtils';
import { TIME_WINDOWS } from '../../data/mockPickups';

/**
 * An in-progress pickup with a 4-step status line: Requested, Scheduled, On the way, Completed.
 * Shared by Home ("Next pickup") and the Pickup tab ("Active request").
 */
export default function ActivePickupCard({ pickup, title, actionLabel, onAction }) {
  const { t } = useTranslation();
  const bag = getBagDetails(pickup.quantity);
  const stepIndex = getStatusStepIndex(pickup.status);
  const windowLabel = TIME_WINDOWS.find(w => w.id === pickup.timeWindow)?.label;

  return (
    <section className="border border-border rounded-[8px] bg-white p-5 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">{title}</p>
          <p className="text-sm font-bold text-black mt-1">
            {pickup.quantity} · {bag.weight}
          </p>
          <p className="text-xs text-muted mt-1 inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5 text-muted shrink-0" />
              {pickup.locality}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatShortDate(pickup.date)}</span>
            {windowLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{windowLabel}</span>
              </>
            )}
          </p>
        </div>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="min-h-[44px] px-3 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer shrink-0"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Status line */}
      <ol className="flex items-start" aria-label={title}>
        {PICKUP_STATUS_STEPS.map((status, i) => {
          const reached = i <= stepIndex;
          const current = i === stepIndex;
          return (
            <li
              key={status}
              aria-current={current ? 'step' : undefined}
              className="relative flex-1 min-w-0 flex flex-col items-center gap-1.5"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-[7px] right-1/2 w-full h-0.5 ${reached ? 'bg-primary' : 'bg-border'}`}
                />
              )}
              <span
                className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                  reached ? 'bg-primary border-primary' : 'bg-white border-border'
                }`}
              />
              <span
                className={`text-[11px] leading-tight text-center ${
                  current ? 'font-bold text-black' : 'text-muted'
                }`}
              >
                {t(STATUS_LABEL_KEYS[status])}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

