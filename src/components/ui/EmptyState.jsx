import React from 'react';

/**
 * Reusable EmptyState component for lists or collections with zero items.
 * Uses a professional SVG icon, clear title, description, and optional CTA button.
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
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 bg-surface rounded-2xl border border-border shadow-xs ${className}`}>
      {/* Professional Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-border-light/80 flex items-center justify-center text-muted-light mb-4 shadow-xs">
        {icon ? (
          icon
        ) : (
          <svg className="w-7 h-7 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-black mb-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {/* Optional Call-to-Action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all shadow-card flex items-center gap-1.5 cursor-pointer"
        >
          <span>{actionLabel}</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
