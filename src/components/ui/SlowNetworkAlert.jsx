import React from 'react';
import Button from './Button';

/**
 * Reusable alert for slow network conditions (requests taking longer than ~5 seconds).
 * Provides immediate feedback with manual "Try Again" and "Cancel" options.
 */
export default function SlowNetworkAlert({
  message = "This is taking longer than usual...",
  onRetry,
  onCancel,
  className = "",
}) {
  return (
    <div className={`p-4 bg-yellow-light border border-yellow/35 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-yellow/25 flex items-center justify-center text-yellow-dark shrink-0">
          <svg className="w-4 h-4 stroke-current animate-pulse" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <p className="text-body-sm font-bold text-ink">{message}</p>
          <p className="text-caption text-muted mt-0.5">Slow mobile data or poor connection detected.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
