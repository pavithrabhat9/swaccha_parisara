import React from 'react';
import Button from './Button';

/**
 * Reusable EmptyState component with a palette-only inline SVG illustration.
 */
export default function EmptyState({
  icon,
  title = "No items yet",
  description = "There is currently nothing to display here.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-3xl border border-border/80 shadow-card ${className}`}>
      {icon ? (
        <div className="w-16 h-16 rounded-2xl bg-primary-lighter border border-primary/15 flex items-center justify-center text-primary mb-5">
          {icon}
        </div>
      ) : (
        <div className="mb-5 animate-float" aria-hidden="true">
          <svg width="88" height="72" viewBox="0 0 88 72" fill="none">
            <ellipse cx="44" cy="62" rx="30" ry="5" fill="#e3eedd" />
            <rect x="22" y="20" width="44" height="36" rx="10" fill="#f2f7ef" stroke="#38761d" strokeWidth="2" />
            <path d="M22 30H66" stroke="#e4e9e1" strokeWidth="2" />
            <circle cx="62" cy="18" r="9" fill="#fab328" />
            <path d="M59 18.2L61.2 20.4L65.5 16" stroke="#10180c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M44 48V38M44 40C44 36.5 47 34.5 50 34.5C50 38 47.5 40 44 40ZM44 42C44 39 41.5 37 38.5 37C38.5 40 41 42 44 42Z" stroke="#38761d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <h3 className="text-heading text-ink mb-1.5">
        {title}
      </h3>

      <p className="text-body-sm text-muted max-w-xs leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          rightIcon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
