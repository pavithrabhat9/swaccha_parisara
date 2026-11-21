import React from 'react';
import { cn } from '../../utils/cn';

const STATUS_STYLES = {
  Reported: 'bg-yellow-light text-yellow-dark',
  'Being Reviewed': 'bg-yellow-light text-yellow-dark',
  Cleared: 'bg-primary-light text-primary-dark',
  Requested: 'bg-yellow-light text-yellow-dark',
  Scheduled: 'bg-yellow-light text-yellow-dark',
  'On the way': 'bg-primary-light text-primary-dark',
  Completed: 'bg-primary-light text-primary-dark',
  Skipped: 'bg-sunken text-muted',
  Paused: 'bg-orange-red-light text-orange-red-dark',
};

/**
 * StatusBadge — Clean, borderless tinted status label (zero fake dots).
 */
export default function StatusBadge({ status, label, size = 'sm', className = '' }) {
  const styles = STATUS_STYLES[status] || 'bg-sunken text-muted';

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2.5 py-0.5'
      : 'text-xs px-3 py-1';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg font-bold whitespace-nowrap',
        styles,
        sizeClasses,
        className
      )}
    >
      {label || status}
    </span>
  );
}
