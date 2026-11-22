import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import EmptyState from '../ui/EmptyState';
import { TruckIcon, GiftIcon, MapPinIcon, TrashIcon, XIcon } from '../ui/Icons';
import { formatTimeAgo } from '../../utils/homeUtils';
import { cn } from '../../utils/cn';

const TYPE_ICONS = { pickup: TruckIcon, points: GiftIcon, report: MapPinIcon };

/**
 * NotificationInbox — Tactile consumer notifications sheet / desktop popover.
 * - Tapping a notification marks it read, closes the inbox, and navigates to the target.
 * - Includes a 44px TrashIcon delete tap target with zero row layout shift and double-tap protection.
 */
export default function NotificationInbox({
  open,
  onClose,
  anchor,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onDelete,
  onSelectNotification,
}) {
  const { t, i18n } = useTranslation();
  const panelRef = useRef(null);
  const busyIdsRef = useRef(new Set());

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

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleRowTap = async (n) => {
    const lockKey = `tap:${n.id}`;
    if (busyIdsRef.current.has(lockKey)) return;
    busyIdsRef.current.add(lockKey);
    try {
      await onMarkRead?.(n.id);
      if (onSelectNotification) {
        onClose();
        await onSelectNotification(n);
      }
    } finally {
      busyIdsRef.current.delete(lockKey);
    }
  };

  const handleDeleteTap = async (e, n) => {
    e.stopPropagation();
    const lockKey = `del:${n.id}`;
    if (busyIdsRef.current.has(lockKey)) return;
    busyIdsRef.current.add(lockKey);
    try {
      await onDelete?.(n.id);
    } finally {
      busyIdsRef.current.delete(lockKey);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end md:block bg-black/40 md:bg-transparent animate-fade-in"
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
          bg-white rounded-t-3xl shadow-modal animate-slide-up
          md:fixed md:w-[380px] md:max-h-[70dvh] md:rounded-2xl md:shadow-elevated
          md:animate-slide-down md:top-[var(--pop-top,64px)] md:right-[var(--pop-right,24px)]
        "
      >
        <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3 border-b border-border-light shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-ink text-balance">{t('home_inbox_title')}</h2>
            {unreadCount > 0 && (
              <p className="tabular text-xs font-bold text-primary">
                {unreadCount} {t('home_inbox_unread')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              className="min-h-10 px-2.5 text-xs font-bold text-primary hover:bg-primary-light/60 disabled:text-muted-light disabled:cursor-not-allowed cursor-pointer rounded-xl"
            >
              {t('home_inbox_mark_all')}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('home_inbox_close')}
              className="touch-target size-10 rounded-xl text-muted hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>

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
              {notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type] || TruckIcon;
                return (
                  <li key={n.id}>
                    <div
                      className={cn(
                        'w-full min-h-11 pl-5 pr-2 py-2.5 flex items-start gap-2 transition-colors duration-150',
                        n.unread ? 'bg-primary-lighter/80' : 'bg-white hover:bg-sunken/60'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleRowTap(n)}
                        className="min-w-0 flex-1 py-1 flex items-start gap-3 text-left cursor-pointer"
                      >
                        <span
                          className={cn(
                            'size-10 rounded-xl flex items-center justify-center shrink-0',
                            n.unread ? 'bg-primary text-white' : 'bg-sunken text-primary'
                          )}
                          aria-hidden="true"
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1 space-y-0.5">
                          <span className="flex items-center justify-between gap-2">
                            <span className={cn('text-sm text-ink truncate', n.unread ? 'font-extrabold' : 'font-semibold')}>
                              {n.title}
                            </span>
                            {n.unread && (
                              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary-dark text-[10px] font-bold shrink-0">
                                {t('home_inbox_unread')}
                              </span>
                            )}
                          </span>
                          <span className="block text-xs text-muted text-pretty leading-snug">{n.body}</span>
                          <span className="block tabular text-[11px] text-muted-light">
                            {formatTimeAgo(n.createdAt, i18n.language)}
                          </span>
                        </span>
                      </button>

                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTap(e, n)}
                          aria-label={t('home_inbox_delete_aria', { defaultValue: 'Delete notification' })}
                          className="touch-target size-11 rounded-xl text-muted hover:text-orange-red-dark hover:bg-sunken flex items-center justify-center shrink-0 cursor-pointer transition-colors duration-150"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p
          className="px-5 py-2.5 text-[11px] text-muted-light border-t border-border-light shrink-0 bg-cream/70"
          style={{ paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {t('sample_data_note')}
        </p>
      </div>
    </div>,
    document.body
  );
}
