import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import EmptyState from '../ui/EmptyState';
import { TruckIcon, GiftIcon, MapPinIcon, XIcon } from '../ui/Icons';
import { formatTimeAgo } from '../../utils/homeUtils';

const TYPE_ICONS = { pickup: TruckIcon, points: GiftIcon, report: MapPinIcon };

/**
 * Notification inbox: bottom sheet on mobile, popover anchored under the bell on desktop.
 * Rendered in a portal so it is never trapped by an animated ancestor.
 */
export default function NotificationInbox({
  open,
  onClose,
  anchor,
  notifications,
  onMarkAllRead,
  onMarkRead,
}) {
  const { t, i18n } = useTranslation();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-end md:block bg-black/40 md:bg-transparent animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('home_inbox_title')}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={
          anchor
            ? { '--pop-top': `${anchor.top}px`, '--pop-right': `${anchor.right}px` }
            : undefined
        }
        className="
          w-full max-h-[78dvh] flex flex-col overflow-hidden outline-none
          bg-white rounded-t-[24px] shadow-modal animate-slide-up
          md:fixed md:w-[380px] md:max-h-[70vh] md:rounded-[24px] md:shadow-elevated md:border md:border-border
          md:animate-slide-down md:top-[var(--pop-top,72px)] md:right-[var(--pop-right,24px)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3 border-b border-border-light shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-black">{t('home_inbox_title')}</h2>
            {unreadCount > 0 && (
              <p className="text-[11px] font-semibold text-primary">
                {unreadCount} {t('home_inbox_unread')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              className="min-h-[44px] px-2.5 text-xs font-semibold text-primary hover:text-primary-dark disabled:text-muted-light disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            >
              {t('home_inbox_mark_all')}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('home_inbox_close')}
              className="touch-target w-11 h-11 rounded-full text-muted hover:text-black hover:bg-sunken flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List or empty state */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title={t('home_inbox_empty_title')}
                description={t('home_inbox_empty_text')}
              />
            </div>
          ) : (
            <ul className="divide-y divide-border-light">
              {notifications.map(n => {
                const Icon = TYPE_ICONS[n.type] || TruckIcon;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => onMarkRead(n.id)}
                      className={`w-full min-h-[44px] px-5 py-3.5 flex items-start gap-3 text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:bg-primary-lighter ${
                        n.unread ? 'bg-primary-lighter' : 'bg-white hover:bg-sunken'
                      }`}
                    >
                      <span
                        className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="flex items-center gap-2">
                          <span className={`text-sm text-black truncate ${n.unread ? 'font-bold' : 'font-semibold'}`}>
                            {n.title}
                          </span>
                          {n.unread && (
                            <>
                              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-orange-red shrink-0" />
                              <span className="sr-only">{t('home_inbox_unread')}</span>
                            </>
                          )}
                        </span>
                        <span className="block text-xs text-muted leading-snug">{n.body}</span>
                        <span className="block text-[11px] text-muted-light">
                          {formatTimeAgo(n.createdAt, i18n.language)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p
          className="px-5 py-2.5 text-[11px] text-muted-light border-t border-border-light shrink-0"
          style={{ paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {t('sample_data_note')}
        </p>
      </div>
    </div>,
    document.body
  );
}

