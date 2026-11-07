import React from 'react';
import Button from './Button';

/**
 * Reusable alert for device/browser permission denied (e.g., Camera or Geolocation).
 * Explicitly provides a manual fallback path so the user flow never breaks.
 */
export default function PermissionAlert({
  title = "Permission Denied",
  message = "Please use the manual option below to continue.",
  fallbackLabel = "Use Manual Option",
  onFallback,
  className = "",
}) {
  return (
    <div className={`p-4 bg-yellow-light/70 border border-yellow/35 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-yellow/25 flex items-center justify-center text-yellow-dark shrink-0">
          <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <p className="text-body-sm font-bold text-ink">{title}</p>
          <p className="text-caption text-muted mt-0.5 leading-snug">{message}</p>
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
