import React from 'react';
import Button from './Button';

/**
 * Reusable SuccessState component with animated badge illustration + ring burst.
 */
export default function SuccessState({
  title = "Success!",
  description = "Your action has been completed.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  children,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[65vh] px-6 py-8 animate-fade-in-up ${className}`}>
      {/* Animated Celebration Emblem */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-6" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border-2 border-primary/35 animate-ring-burst" />
        <span className="absolute inset-2 rounded-full bg-primary-light/70" />
        <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-fab animate-scale-in">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 0,
                animation: 'checkmark 0.55s ease-out 0.25s both',
              }}
            />
          </svg>
        </div>
        {/* Accent sparkles in brand yellow */}
        <span className="absolute -top-1 right-1 w-3 h-3 rounded-full bg-yellow animate-scale-in" />
        <span className="absolute bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-primary-dark animate-scale-in" />
      </div>

      <h2 className="text-title text-ink mb-2 text-center">
        {title}
      </h2>
      <p className="text-body-sm text-muted text-center max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {children && (
        <div className="w-full max-w-sm mb-6">
          {children}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
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
