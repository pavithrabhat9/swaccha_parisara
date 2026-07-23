import React from 'react';

const STATUS_STYLES = {
  'Reported': 'bg-yellow-light text-yellow border-yellow/20',
  'Being Reviewed': 'bg-yellow-light text-yellow border-yellow/20',
  'Cleared': 'bg-primary-light text-primary border-primary/20',
  'Requested': 'bg-yellow-light text-yellow border-yellow/20',
  'Scheduled': 'bg-yellow-light text-yellow border-yellow/20',
  'Completed': 'bg-primary-light text-primary border-primary/20',
  'Skipped': 'bg-border-light text-muted border-border',
  'Paused': 'bg-orange-red-light text-orange-red border-orange-red/20',
};

const STATUS_DOTS = {
  'Reported': 'bg-yellow',
  'Being Reviewed': 'bg-yellow',
  'Cleared': 'bg-primary',
  'Requested': 'bg-yellow',
  'Scheduled': 'bg-yellow',
  'Completed': 'bg-primary',
  'Skipped': 'bg-muted-light',
  'Paused': 'bg-orange-red',
};

/**
 * Color-coded status pill badge.
 * Used for report statuses, pickup statuses, business schedule statuses.
 */
export default function StatusBadge({ status, size = 'sm' }) {
  const styles = STATUS_STYLES[status] || 'bg-border-light text-muted border-border';
  const dotColor = STATUS_DOTS[status] || 'bg-muted';

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2.5 py-0.5'
    : 'text-xs px-3 py-1';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide
        border ${styles} ${sizeClasses} whitespace-nowrap
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}
