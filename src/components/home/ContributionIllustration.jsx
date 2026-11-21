import React from 'react';

/**
 * ContributionIllustration — Warm layered coastal leaf & recovery ring artwork
 * designed for the hero emerald impact card (zero wireframe boxes or mono stamps).
 */
export default function ContributionIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 140 112" fill="none" role="img" aria-hidden="true">
      {/* Concentric soft recovery rings */}
      <circle cx="76" cy="56" r="46" fill="#ffffff" fillOpacity="0.08" />
      <circle cx="76" cy="56" r="34" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="5 5" />
      <circle cx="76" cy="56" r="24" fill="#ffffff" fillOpacity="0.14" />

      {/* Sunlit amber accent orb */}
      <circle cx="114" cy="24" r="9" fill="#fbbf24" />
      <circle cx="114" cy="24" r="14" fill="#fbbf24" fillOpacity="0.2" />

      {/* Layered coastal botanical leaf */}
      <path
        d="M96 34C76 34 58 45 53 66C52 70 55 74 59 75C80 79 96 63 99 39C99.5 36 98.2 34 96 34Z"
        fill="#ffffff"
        fillOpacity="0.95"
      />
      <path
        d="M50 80C60 66 72 56 87 48"
        stroke="#0d7a57"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M67 62L63 54M76 55L73 48"
        stroke="#0d7a57"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />

      {/* Secondary soft mint leaf */}
      <path
        d="M34 58C42 54 51 58 55 68C45 71 36 67 34 58Z"
        fill="#a7f3d0"
        fillOpacity="0.88"
      />
    </svg>
  );
}
