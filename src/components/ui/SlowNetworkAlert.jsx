import React from 'react';

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
    <div className={`p-3.5 bg-yellow-light/80 border border-yellow/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-yellow/20 flex items-center justify-center text-yellow shrink-0">
          <svg className="w-4 h-4 stroke-current animate-pulse" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-black">{message}</p>
          <p className="text-[11px] text-muted">Slow mobile data or poor connection detected.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 bg-white border border-border text-black text-xs font-semibold rounded-lg hover:border-yellow transition-all shadow-xs cursor-pointer"
          >
            Try Again
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-muted hover:text-black text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
