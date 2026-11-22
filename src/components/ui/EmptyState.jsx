import React from 'react';
import Button from './Button';
import { EmptyStateIllustration } from '../onboarding/OnboardingIllustrations';
import { cn } from '../../utils/cn';

/**
 * EmptyState — Editorial Line-interior spot illustration empty state.
 */
export default function EmptyState({
  icon,
  title = 'No records found',
  description = 'There are currently no entries in this view.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-8 px-6 bg-white rounded-2xl border border-border',
        className
      )}
    >
      {icon ? (
        <div
          className="size-12 rounded-xl bg-sunken border border-border flex items-center justify-center text-primary mb-3.5"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : (
        <div
          className="w-44 aspect-[4/3] rounded-xl overflow-hidden bg-white border border-border/70 shadow-xs mb-4"
          aria-hidden="true"
        >
          <EmptyStateIllustration />
        </div>
      )}

      <h3 className="text-heading font-bold text-ink text-balance mb-1">
        {title}
      </h3>

      <p className="text-body-sm text-muted text-pretty max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
