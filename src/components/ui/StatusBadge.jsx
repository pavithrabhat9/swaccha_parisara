import React from 'react';
import { cn } from '../../utils/cn';

const STATUS_STYLES = {
  Reported: 'bg-yellow-light text-yellow-dark border-yellow/35',
  'Being Reviewed': 'bg-yellow-light text-yellow-dark border-yellow/35',
  Cleared: 'bg-primary-light text-primary-dark border-primary/25',
  Requested: 'bg-yellow-light text-yellow-dark border-yellow/35',
  Scheduled: 'bg-yellow-light text-yellow-dark border-yellow/35',
  'On the way': 'bg-yellow-light text-yellow-dark border-yellow/35',
  Completed: 'bg-primary-light text-primary-dark border-primary/25',
  Skipped: 'bg-sunken text-muted border-border',
  Paused: 'bg-orange-red-light text-orange-red-dark border-orange-red/30',
};

const STATUS_DOTS = {
  Reported: 'bg-yellow',
  'Being Reviewed': 'bg-yellow',
  Cleared: 'bg-primary',
  Requested: 'bg-yellow',
  Scheduled: 'bg-yellow',
  'On the way': 'bg-yellow',
  Completed: 'bg-primary',
  Skipped: 'bg-muted-light',
  Paused: 'bg-orange-red',
};

/**
 * Color-coded status pill badge.
 * Used for report statuses, pickup statuses, business schedule statuses.
 */
export default function StatusBadge({ status, label, size = 'sm', className = '' }) {
  const styles = STATUS_STYLES[status] || 'bg-sunken text-muted border-border';
  const dotColor = STATUS_DOTS[status] || 'bg-muted';

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2.5 py-0.5'
      : 'text-caption px-3 py-1';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border whitespace-nowrap',
        styles,
        sizeClasses,
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', dotColor)} aria-hidden="true" />
      {label || status}
    </span>
  );
}
