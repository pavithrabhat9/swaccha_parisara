import React from 'react';

export const BagSmallIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const BagMediumIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export const BagLargeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
    <path d="m7 16.5-4.74-2.85" />
    <path d="m7 16.5 5-3" />
    <path d="M7 16.5v5.17" />
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
    <path d="m17 16.5-5-3" />
    <path d="m17 16.5 4.74-2.85" />
    <path d="M17 16.5v5.17" />
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
    <path d="M12 8 7.26 5.15" />
    <path d="m12 8 4.74-2.85" />
    <path d="M12 13.5V8" />
  </svg>
);

export const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const XIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const GlobeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/**
 * BrandMark — custom Swachha Parisara mark (leaf + circular loop).
 * Supports `inverted` for placement on the primary green top header.
 */
export const BrandMark = ({ className = "w-9 h-9", inverted = false }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect width="36" height="36" rx="11" fill={inverted ? "#ffffff" : "#38761d"} />
    <path
      d="M25.5 13.5C25.5 19.5 20.5 24.5 13.5 24.5C11.8 24.5 10.5 23.8 10.5 22C10.5 16 15.5 11 22.5 11C24.2 11 25.5 11.8 25.5 13.5Z"
      fill={inverted ? "#38761d" : "#e3eedd"}
      fillOpacity={inverted ? "0.16" : "0.22"}
    />
    <path
      d="M12 23.5C14.5 19.5 18.5 16.5 24 14.5M24 14.5C24 20.2 19.6 24.2 13.5 24.2C11.9 24.2 11 23.1 11 21.5C11 15.6 15.6 11.5 22 11.5C23.4 11.5 24 12.4 24 14.5Z"
      stroke={inverted ? "#38761d" : "#ffffff"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24.5" cy="11.5" r="2" fill="#fab328" />
  </svg>
);

/**
 * BadgeMedal — palette-only SVG badge icon keyed by badge id (`starter`, `bronze`, `silver`, `gold`, `champion`).
 */
export function BadgeMedal({ id = 'starter', locked = false, className = 'w-7 h-7' }) {
  const key = (id || 'starter').toLowerCase();
  const opacity = locked ? 'opacity-40' : '';

  if (key.includes('champion')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="#fab328" stroke="#38761d" strokeWidth="2" />
        <path d="M11 11H21V15C21 17.8 18.8 20 16 20C13.2 20 11 17.8 11 15V11Z" fill="#ffffff" stroke="#10180c" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M13 23H19M16 20V23" stroke="#10180c" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes('gold')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#fab328" stroke="#b97a05" strokeWidth="2" />
        <path d="M16 9.5L17.9 13.4L22.2 14L19.1 17L19.8 21.3L16 19.3L12.2 21.3L12.9 17L9.8 14L14.1 13.4L16 9.5Z" fill="#ffffff" stroke="#b97a05" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes('silver')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#e3eedd" stroke="#38761d" strokeWidth="2" />
        <path d="M16 9.5L17.9 13.4L22.2 14L19.1 17L19.8 21.3L16 19.3L12.2 21.3L12.9 17L9.8 14L14.1 13.4L16 9.5Z" fill="#ffffff" stroke="#38761d" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes('bronze')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#fef4dc" stroke="#b97a05" strokeWidth="2" />
        <circle cx="16" cy="16" r="6" fill="#fab328" />
        <path d="M13.5 16L15.2 17.7L18.8 14.2" stroke="#10180c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Starter (leaf sprout)
  return (
    <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#e3eedd" stroke="#38761d" strokeWidth="2" />
      <path d="M16 22V14M16 16C16 12.5 19 10.5 22 10.5C22 14 19.5 16 16 16ZM16 18C16 15 13.5 13 10.5 13C10.5 16 13 18 16 18Z" stroke="#38761d" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
