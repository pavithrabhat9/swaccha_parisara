import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from '../../utils/dateUtils';

const STATUS_TITLE_KEYS = {
  Requested: 'home_pickup_card_requested',
  Scheduled: 'home_pickup_card_scheduled',
  'On the way': 'home_pickup_card_on_the_way',
};

/**
 * Original inline SVG calendar icon in the app palette (#38761d green, #ffffff white, #fab328 yellow accent).
 */
function PickupCalendarGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="4" fill="#ffffff" stroke="#38761d" strokeWidth="1.9" />
      <path d="M3 9.5H21" stroke="#38761d" strokeWidth="1.9" />
      <line x1="8" y1="3" x2="8" y2="6.5" stroke="#38761d" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="6.5" stroke="#38761d" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1.5" fill="#38761d" />
      <circle cx="15" cy="14" r="2.2" fill="#fab328" />
    </svg>
  );
}

/**
 * Small arrow icon for the outlined "Track" button.
 */
function ArrowRightGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Compact one-row Scheduled Pickup card:
 * - Left: original inline SVG calendar icon with yellow accent
 * - Middle: status-driven title + date
 * - Right: outlined "Track" button
 */
export default function ScheduledPickupCard({ item }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const titleKey = STATUS_TITLE_KEYS[item.status] || 'home_pickup_card_scheduled';
  const targetPath = item.kind === 'business' ? '/pickup?tab=business' : '/pickup?tab=home';

  const handleTrack = () => {
    navigate(targetPath);
  };

  return (
    <div
      onClick={handleTrack}
      className="min-h-[72px] rounded-2xl bg-primary-light/65 border border-primary/15 px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-primary-light/85 transition-colors duration-150"
    >
      {/* Left + Middle: Calendar icon + Title & Date */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="size-11 rounded-xl bg-white/95 border border-primary/15 flex items-center justify-center shrink-0">
          <PickupCalendarGlyph />
        </span>

        <div className="min-w-0 leading-snug">
          <p className="text-sm font-bold text-ink truncate">
            {t(titleKey)}
          </p>
          <p className="text-xs text-muted tabular truncate mt-0.5">
            {formatShortDate(item.date)}
          </p>
        </div>
      </div>

      {/* Right: Outlined "Track" button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleTrack();
        }}
        aria-label={t('home_pickup_track_aria')}
        className="min-h-9 px-3.5 py-1.5 rounded-full border border-primary/40 bg-white/90 hover:bg-white text-primary-dark text-xs font-semibold leading-none inline-flex items-center gap-1.5 shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>{t('home_pickup_track')}</span>
        <ArrowRightGlyph />
      </button>
    </div>
  );
}
