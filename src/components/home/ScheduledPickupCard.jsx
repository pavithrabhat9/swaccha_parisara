import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from '../../utils/dateUtils';
import StatusBadge from '../ui/StatusBadge';
import { CalendarIcon, ChevronRightIcon } from '../ui/Icons';

const STATUS_TITLE_KEYS = {
  Requested: 'home_pickup_card_requested',
  Scheduled: 'home_pickup_card_scheduled',
  'On the way': 'home_pickup_card_on_the_way',
};

/**
 * ScheduledPickupCard — Tactile full-card interactive pickup row
 * (like Urban Company / Swiggy order cards — no repetitive Track > wireframe buttons).
 */
export default function ScheduledPickupCard({ item }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const titleKey = STATUS_TITLE_KEYS[item.status] || 'home_pickup_card_scheduled';
  const targetPath = item.kind === 'business' ? '/pickup?tab=business' : '/pickup?tab=home';
  const isOnWay = item.status === 'On the way';

  return (
    <button
      type="button"
      onClick={() => navigate(targetPath)}
      aria-label={`${t(titleKey)} — ${formatShortDate(item.date)}`}
      className="w-full text-left rounded-2xl card-interactive px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span
          className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
            isOnWay
              ? 'bg-primary-light text-primary'
              : 'bg-yellow-light text-yellow-dark'
          }`}
        >
          <CalendarIcon className="size-5" />
        </span>

        <div className="min-w-0 leading-snug">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-ink truncate">
              {t(titleKey)}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <span className="block tabular text-xs font-medium text-muted truncate mt-0.5">
            {formatShortDate(item.date)}
          </span>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="size-8 rounded-xl bg-sunken text-muted flex items-center justify-center shrink-0"
      >
        <ChevronRightIcon className="size-4" />
      </span>
    </button>
  );
}
