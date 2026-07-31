import React from 'react';

/**
 * Reusable SuccessState component for confirming completed actions.
 * Displays a unified animated green SVG checkmark, title, description, and optional action buttons.
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
    <div className={`flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in-up ${className}`}>
      {/* Animated Checkmark Icon */}
      <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-5 animate-scale-in shadow-xs">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38761d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline
            points="20 6 9 17 4 12"
            style={{
              strokeDasharray: 24,
              strokeDashoffset: 0,
              animation: 'checkmark 0.5s ease-out 0.3s both',
            }}
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-black mb-1.5 text-center">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-muted text-center max-w-xs mb-6 leading-relaxed">
        {description}
      </p>

      {/* Optional detail slots (e.g., summary table or photo preview) */}
      {children && (
        <div className="w-full max-w-xs mb-6">
          {children}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex-1 py-3 px-4 bg-primary text-white font-semibold rounded-xl text-xs sm:text-sm
              hover:bg-primary-dark active:scale-[0.98] transition-all shadow-card cursor-pointer text-center"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="flex-1 py-3 px-4 bg-surface border border-border rounded-xl text-xs sm:text-sm font-semibold text-black
              hover:bg-border-light active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
