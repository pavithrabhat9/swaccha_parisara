import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPinIcon } from '../ui/Icons';
import StatusBadge from '../ui/StatusBadge';
import { getBagDetails } from '../../utils/pickupUtils';
import { PICKUP_STATUS_STEPS, STATUS_LABEL_KEYS, getStatusStepIndex } from '../../utils/pickupStatusUtils';
import { formatShortDate } from '../../utils/dateUtils';
import { TIME_WINDOWS } from '../../data/mockPickups';
import { cn } from '../../utils/cn';

/**
 * ActivePickupCard — Expressive consumer pickup tracker card (Urban Company / Swiggy order tracker feel).
 */
export default function ActivePickupCard({ pickup, title, actionLabel, onAction }) {
  const { t } = useTranslation();
  const bag = getBagDetails(pickup.quantity);
  const stepIndex = getStatusStepIndex(pickup.status);
  const windowLabel = TIME_WINDOWS.find(w => w.id === pickup.timeWindow)?.label;

  return (
    <section className="rounded-2xl card-elevated overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-extrabold text-ink text-balance tracking-tight">{title}</h2>
            <StatusBadge status={pickup.status} />
          </div>
          <p className="tabular text-sm font-bold text-primary mt-1.5">
            {pickup.quantity} · {bag.weight}
          </p>
          <p className="text-xs font-medium text-muted mt-1 inline-flex flex-wrap items-center gap-x-2 gap-y-1 tabular">
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-3.5 text-primary shrink-0" />
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
            className="min-h-10 px-3 rounded-xl bg-primary-light hover:bg-primary/15 text-xs font-bold text-primary-dark cursor-pointer shrink-0 transition-colors duration-150"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Smooth circular 4-step tracker */}
      <div className="px-5 py-4 bg-primary-lighter/75">
        <ol className="flex items-start" aria-label={title}>
          {PICKUP_STATUS_STEPS.map((status, i) => {
            const reached = i <= stepIndex;
            const current = i === stepIndex;
            return (
              <li
                key={status}
                aria-current={current ? 'step' : undefined}
                className="relative flex-1 min-w-0 flex flex-col items-center gap-2"
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-[7px] right-1/2 w-full h-[2.5px] rounded-full',
                      reached ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 size-4 rounded-full border-2 transition-transform duration-200',
                    reached ? 'bg-primary border-primary' : 'bg-white border-border',
                    current && 'ring-4 ring-primary/20 scale-110'
                  )}
                />
                <span
                  className={cn(
                    'text-[11px] leading-tight text-center',
                    current ? 'font-extrabold text-primary-dark' : reached ? 'font-semibold text-ink' : 'font-medium text-muted'
                  )}
                >
                  {t(STATUS_LABEL_KEYS[status])}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
