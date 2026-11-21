import React from 'react';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const BagSmallIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const BagMediumIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export const BagLargeIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="9" y1="4" x2="9" y2="20" />
    <line x1="15" y1="4" x2="15" y2="20" />
  </svg>
);

export const MapPinIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const CheckCircleIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="16 9 10.5 14.5 8 12" />
  </svg>
);

export const CalendarIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const ClockIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

export const XIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const GlobeIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3a14.5 14.5 0 0 1 3.6 9 14.5 14.5 0 0 1-3.6 9 14.5 14.5 0 0 1-3.6-9 14.5 14.5 0 0 1 3.6-9z" />
  </svg>
);

export const UserIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const HomeIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const GiftIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 2 19 6v6c0 5-3.2 8.8-7 10-3.8-1.2-7-5-7-10V6l7-4Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const ChatBubbleIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const SendIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const TrashIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const PlusIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const EditIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const LockIcon = ({ className = 'size-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * BrandMark — Warm coastal emerald leaf emblem with sunlit amber accent.
 */
export const BrandMark = ({ className = 'size-9', inverted = false }) => {
  const leafFill = inverted ? '#0d7a57' : '#ffffff';
  const veinStroke = inverted ? '#ffffff' : '#0d7a57';
  const accentDot = '#fbbf24';

  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {inverted ? (
        <rect width="40" height="40" rx="11" fill="#ffffff" />
      ) : (
        <>
          <defs>
            <linearGradient id="sp-brand-grad" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#14966b" />
              <stop offset="100%" stopColor="#085b40" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill="url(#sp-brand-grad)" />
        </>
      )}
      <path
        d="M27.5 12.5C21 12.5 14.5 16.2 13 23.8C12.7 25.3 13.7 26.8 15.2 27.1C22.4 28.4 27.8 22.8 28.5 14.2C28.6 13.2 28.2 12.5 27.5 12.5Z"
        fill={leafFill}
        fillOpacity="0.96"
      />
      <path
        d="M12.5 28.5C15.5 24 19.8 20.2 24.5 17.5"
        stroke={veinStroke}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="28" cy="27.5" r="2.6" fill={accentDot} />
    </svg>
  );
};

export const StarIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.4l2.75 5.57 6.15.89-4.45 4.34 1.05 6.12L12 16.43l-5.5 2.89 1.05-6.12L3.1 8.86l6.15-.89L12 2.4z" />
  </svg>
);

/**
 * BadgeMedal — Warm tactile consumer tier & achievement emblems.
 */
export function BadgeMedal({ id = 'starter', locked = false, className = 'size-7' }) {
  const key = (id || 'starter').toLowerCase();
  const opacity = locked ? 'opacity-40 grayscale' : '';

  if (key.includes('champion') || key.includes('gold')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="10" fill="#fef5e0" />
        <circle cx="16" cy="16" r="9.5" fill="#f59e0b" />
        <path d="M16 10.5l1.65 3.35 3.7.54-2.68 2.61.63 3.68L16 18.95l-3.3 1.73.63-3.68-2.68-2.61 3.7-.54L16 10.5z" fill="#ffffff" />
      </svg>
    );
  }

  if (key.includes('silver')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="10" fill="#e5f6ef" />
        <circle cx="16" cy="16" r="9.5" fill="#0d7a57" />
        <path d="M12.2 16.2L14.8 18.8L20 13.4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (key.includes('bronze')) {
    return (
      <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="10" fill="#fff0ec" />
        <circle cx="16" cy="16" r="9.5" fill="#e05232" />
        <path d="M12.5 16.2L14.8 18.5L19.8 13.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={`${className} ${opacity}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="#e5f6ef" />
      <circle cx="16" cy="16" r="8.5" fill="#0d7a57" fillOpacity="0.16" />
      <circle cx="16" cy="16" r="4" fill="#0d7a57" />
    </svg>
  );
}

export const CameraIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const UploadIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const BookIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const QrIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4" />
  </svg>
);

export const ScanFrameIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M3 8V5a2 2 0 0 1 2-2h3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
    <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
    <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
  </svg>
);

export const ChevronRightIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ArrowLeftIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const DirectionsIcon = ({ className = 'size-4' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

export const HeartIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const LeafIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const BellIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const TruckIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke}>
    <rect x="1" y="3" width="15" height="13" rx="1.5" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export const PlayIcon = ({ className = 'size-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z" />
  </svg>
);
