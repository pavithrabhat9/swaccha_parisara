import React from 'react';
import Button from './Button';
import { cn } from '../../utils/cn';

export default function PermissionAlert({
  title = 'Permission Denied',
  message = 'Please use the manual option below to continue.',
  fallbackLabel = 'Use Manual Option',
  onFallback,
  className = '',
}) {
  return (
    <div
      className={cn(
        'p-3.5 bg-yellow-light border border-yellow/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in',
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="size-8 rounded-md bg-white border border-yellow/40 flex items-center justify-center text-yellow-dark shrink-0">
          <svg className="size-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-ink">{title}</p>
          <p className="text-caption text-muted text-pretty mt-0.5 leading-snug">{message}</p>
        </div>
      </div>

      {onFallback && (
        <Button variant="secondary" size="sm" onClick={onFallback} className="shrink-0">
          {fallbackLabel}
        </Button>
      )}
    </div>
  );
}
