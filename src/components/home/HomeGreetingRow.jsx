import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationInbox from './NotificationInbox';
import { BellIcon, StarIcon } from '../ui/Icons';

/**
 * HomeGreetingRow — Warm consumer greeting header.
 * Left: soft emerald monogram avatar + greeting + resident name.
 * Right: sunlit marigold rewards points chip (StarIcon, zero fake dots) + elevated bell.
 */
export default function HomeGreetingRow({
  greetingKey,
  firstName,
  initials,
  points,
  notifications,
  unreadCount,
  onMarkAllRead,
  onMarkRead,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const openInbox = () => {
    const rect = bellRef.current?.getBoundingClientRect();
    if (rect) {
      setAnchor({
        top: Math.round(rect.bottom + 8),
        right: Math.max(8, Math.round(window.innerWidth - rect.right)),
      });
    }
    setInboxOpen(true);
  };

  const formattedPoints = Number(points || 0).toLocaleString('en-IN');

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span
          aria-hidden="true"
          className="size-11 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-extrabold flex items-center justify-center shrink-0 shadow-xs"
        >
          {initials}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-xs font-medium text-muted">{t(greetingKey)}</p>
          <h1 className="text-lg sm:text-xl font-extrabold text-ink truncate tracking-tight mt-0.5">
            {firstName}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Sunlit marigold rewards balance button */}
        <button
          type="button"
          onClick={() => navigate('/rewards')}
          aria-label={t('home_rewards_pill_aria', { points: formattedPoints })}
          className="min-h-10 px-3.5 rounded-xl bg-yellow-light hover:bg-yellow/25 text-yellow-dark inline-flex items-center gap-1.5 cursor-pointer press-scale shadow-xs transition-colors duration-150"
        >
          <StarIcon className="size-4 text-yellow shrink-0" />
          <span className="tabular text-sm font-extrabold text-ink">{formattedPoints}</span>
          <span className="hidden min-[380px]:inline text-xs font-semibold text-yellow-dark">pts</span>
        </button>

        {/* Notification bell */}
        <button
          ref={bellRef}
          type="button"
          onClick={openInbox}
          aria-haspopup="dialog"
          aria-expanded={inboxOpen}
          aria-label={
            unreadCount > 0
              ? t('home_notifications_aria_unread', { count: unreadCount })
              : t('home_notifications_aria')
          }
          className="relative size-10 rounded-xl bg-white shadow-xs hover:shadow-card flex items-center justify-center text-ink cursor-pointer press-scale transition-shadow duration-150"
        >
          <BellIcon className="size-4.5" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-lg bg-orange-red text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-cream tabular"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <NotificationInbox
        open={inboxOpen}
        onClose={() => setInboxOpen(false)}
        anchor={anchor}
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
        onMarkRead={onMarkRead}
      />
    </div>
  );
}
