import React from 'react';
import Button from './Button';
import { cn } from '../../utils/cn';

/**
 * EmptyState — Architectural empty ledger state (no cartoon boxes).
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
        'flex flex-col items-center justify-center text-center py-9 px-6 bg-white rounded-xl border border-border',
        className
      )}
    >
      <div
        className="size-12 rounded-lg bg-sunken border border-border flex items-center justify-center text-primary mb-3.5"
        aria-hidden="true"
      >
        {icon || (
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="8" y1="15" x2="16" y2="15" />
          </svg>
        )}
      </div>

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
          rightIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          }
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
