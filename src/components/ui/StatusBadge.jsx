import React from 'react';

const STATUS_STYLES = {
  'Reported': 'bg-yellow-light text-yellow-dark border-yellow/30',
  'Being Reviewed': 'bg-yellow-light text-yellow-dark border-yellow/30',
  'Cleared': 'bg-primary-light text-primary-dark border-primary/20',
  'Requested': 'bg-yellow-light text-yellow-dark border-yellow/30',
  'Scheduled': 'bg-yellow-light text-yellow-dark border-yellow/30',
  'Completed': 'bg-primary-light text-primary-dark border-primary/20',
  'Skipped': 'bg-sunken text-muted border-border',
  'Paused': 'bg-orange-red-light text-orange-red-dark border-orange-red/25',
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
export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const styles = STATUS_STYLES[status] || 'bg-sunken text-muted border-border';
  const dotColor = STATUS_DOTS[status] || 'bg-muted';

  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2.5 py-0.5'
    : 'text-caption px-3 py-1';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold tracking-tight
        border ${styles} ${sizeClasses} whitespace-nowrap ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      {status}
    </span>
  );
}
