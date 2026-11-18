import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationInbox from './NotificationInbox';
import { BellIcon, LeafIcon } from '../ui/Icons';

/**
 * Greeting row: avatar + time-of-day greeting + first name on the left,
 * Rewards pill and notification bell (with unread dot and inbox) on the right.
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
    // Remember where the bell is so the desktop popover can sit right under it
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
          className="w-11 h-11 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-pill"
        >
          {initials}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-xs text-muted">{t(greetingKey)}</p>
          <p className="text-base font-extrabold text-black truncate">{firstName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Rewards pill */}
        <button
          type="button"
          onClick={() => navigate('/rewards')}
          aria-label={t('home_rewards_pill_aria', { points: formattedPoints })}
          className="min-h-[44px] pl-2.5 pr-3 rounded-full bg-white border border-border shadow-xs inline-flex items-center gap-1.5 cursor-pointer press-scale hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <LeafIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-black tabular">{formattedPoints}</span>
          <span className="hidden min-[380px]:inline text-xs font-medium text-muted">{t('rewards')}</span>
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
          className="relative w-11 h-11 rounded-full bg-white border border-border shadow-xs flex items-center justify-center text-ink cursor-pointer press-scale hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BellIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-orange-red ring-2 ring-white"
            />
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

