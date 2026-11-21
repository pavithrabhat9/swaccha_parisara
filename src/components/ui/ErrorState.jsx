import React from 'react';
import Button from './Button';
import { cn } from '../../utils/cn';

/**
 * ErrorState — Structured civic error state with retry action.
 */
export default function ErrorState({
  title = 'Service unavailable',
  description = "We couldn't complete your request. Check your connection and try again.",
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center py-8 px-6 bg-white rounded-xl border border-orange-red/35',
        className
      )}
    >
      <div
        className="size-12 rounded-lg bg-orange-red-light border border-orange-red/30 flex items-center justify-center text-orange-red-dark mb-3.5"
        aria-hidden="true"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h3 className="text-heading font-bold text-ink text-balance mb-1">
        {title}
      </h3>

      <p className="text-body-sm text-muted text-pretty max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          leftIcon={
            <svg className="size-4 text-orange-red-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
