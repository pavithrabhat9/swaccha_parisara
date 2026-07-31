import React from 'react';

/**
 * Reusable ErrorState component for recoverable failures.
 * Shows what went wrong in plain language with a clear "Try Again" action.
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete your request at this moment. Please check your connection and try again.",
  onRetry,
  retryLabel = "Try Again",
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-10 px-6 bg-surface rounded-2xl border border-orange-red/20 shadow-xs ${className}`}>
      {/* Professional Warning/Error Icon */}
      <div className="w-12 h-12 rounded-2xl bg-orange-red-light flex items-center justify-center text-orange-red mb-3 shadow-xs">
        <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3 className="text-sm font-bold text-black mb-1">
        {title}
      </h3>

      <p className="text-xs text-muted max-w-xs leading-relaxed mb-4">
        {description}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white border border-border text-black text-xs font-semibold rounded-xl hover:bg-border-light hover:border-orange-red/40 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-orange-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
