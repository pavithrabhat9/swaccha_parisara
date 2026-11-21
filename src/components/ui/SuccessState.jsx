import React from 'react';
import Button from './Button';
import { cn } from '../../utils/cn';

/**
 * SuccessState — Architectural docket confirmation state (no cartoon confetti).
 */
export default function SuccessState({
  title = 'Confirmed',
  description = 'Your submission has been recorded.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  children,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[48dvh] px-6 py-8 animate-fade-in-up', className)}>
      <div className="relative size-16 flex items-center justify-center mb-5" aria-hidden="true">
        <div className="size-16 rounded-xl bg-primary-light border border-primary/30 flex items-center justify-center animate-scale-in">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f4c3a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 0,
                animation: 'checkmark 0.4s ease-out 0.1s both',
              }}
            />
          </svg>
        </div>
      </div>

      <h2 className="text-title font-bold text-ink text-balance mb-1.5 text-center">
        {title}
      </h2>
      <p className="text-body-sm text-muted text-pretty text-center max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {children && (
        <div className="w-full max-w-sm mb-6">
          {children}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-sm">
        {actionLabel && onAction && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
