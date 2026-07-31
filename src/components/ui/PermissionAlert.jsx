import React from 'react';

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
    <div className={`p-3.5 bg-surface border border-orange-red/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-orange-red-light flex items-center justify-center text-orange-red shrink-0">
          <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-black">{title}</p>
          <p className="text-[11px] text-muted">{message}</p>
        </div>
      </div>

      {onFallback && (
        <button
          onClick={onFallback}
          className="px-3.5 py-1.5 bg-white border border-border text-black text-xs font-semibold rounded-lg hover:bg-border-light transition-all shadow-xs shrink-0 cursor-pointer"
        >
          {fallbackLabel}
        </button>
      )}
    </div>
  );
}
