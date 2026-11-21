import React from 'react';
import Button from './Button';
import { SuccessStateIllustration } from '../onboarding/OnboardingIllustrations';
import { cn } from '../../utils/cn';

/**
 * SuccessState — Editorial Line-interior confirmation card state.
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
      <div
        className="w-52 aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-border/80 shadow-card mb-5 animate-scale-in"
        aria-hidden="true"
      >
        <SuccessStateIllustration />
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
