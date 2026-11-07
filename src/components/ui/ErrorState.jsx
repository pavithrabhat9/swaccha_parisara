import React from 'react';
import Button from './Button';

/**
 * Reusable ErrorState component with a friendly inline SVG illustration in the palette.
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete your request at this moment. Please check your connection and try again.",
  onRetry,
  retryLabel = "Try Again",
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center py-10 px-6 bg-white rounded-3xl border border-orange-red/25 shadow-card ${className}`}
    >
      <div className="mb-4" aria-hidden="true">
        <svg width="80" height="68" viewBox="0 0 80 68" fill="none">
          <ellipse cx="40" cy="60" rx="26" ry="4.5" fill="#feeee8" />
          <path d="M40 12L66 52H14L40 12Z" fill="#feeee8" stroke="#f25628" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="40" y1="27" x2="40" y2="39" stroke="#c73d14" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="40" cy="45.5" r="1.7" fill="#c73d14" />
          <circle cx="60" cy="18" r="4" fill="#fab328" />
        </svg>
      </div>

      <h3 className="text-heading text-ink mb-1">
        {title}
      </h3>

      <p className="text-body-sm text-muted max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={
            <svg className="w-4 h-4 text-orange-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          }
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
