import React from 'react';

/**
 * OnboardingIllustrations — Warm, modern flat-geometric editorial art
 * (vibrant coastal emerald, sunlit marigold, soft mint & coral — zero wireframe stamps).
 */

export function ReportIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" role="img" aria-hidden="true">
      {/* Soft coastal map backdrop */}
      <rect x="20" y="18" width="200" height="144" rx="22" fill="#e5f6ef" />
      <path d="M20 124C64 106 106 116 150 82C176 62 198 50 220 46V140C220 152.15 210.15 162 198 162H42C29.85 162 20 152.15 20 140V124Z" fill="#cdeee1" />
      {/* Coastal roads */}
      <path d="M44 46C88 54 114 96 164 106C184 110 202 106 220 98" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      <path d="M98 18C104 62 84 112 72 162" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      {/* Tactile circular pin with warm pulse halo */}
      <circle cx="122" cy="84" r="32" fill="#0d7a57" fillOpacity="0.14" />
      <circle cx="122" cy="84" r="19" fill="#0d7a57" />
      <circle cx="122" cy="84" r="19" stroke="#ffffff" strokeWidth="3.5" />
      <circle cx="122" cy="84" r="6" fill="#ffffff" />
      {/* Secondary nearby hotspot circle */}
      <circle cx="172" cy="64" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="72" cy="116" r="8" fill="#e05232" stroke="#ffffff" strokeWidth="2.5" />
    </svg>
  );
}

export function PickupIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" role="img" aria-hidden="true">
      <rect x="20" y="18" width="200" height="144" rx="22" fill="#fef5e0" />
      <circle cx="176" cy="52" r="28" fill="#f59e0b" fillOpacity="0.18" />
      {/* Elevated white doorstep pickup card */}
      <rect x="44" y="42" width="152" height="96" rx="18" fill="#ffffff" />
      {/* Emerald bag icon tile */}
      <rect x="60" y="58" width="44" height="44" rx="12" fill="#e5f6ef" />
      <path d="M74 72L71 76V90C71 91.1 71.9 92 73 92H91C92.1 92 93 91.1 93 90V76L90 72H74Z" stroke="#0d7a57" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M71 76H93" stroke="#0d7a57" strokeWidth="2.2" />
      <path d="M86 80C86 82.2 84.2 84 82 84C79.8 84 78 82.2 78 80" stroke="#0d7a57" strokeWidth="2.2" strokeLinecap="round" />
      {/* Card content bars */}
      <rect x="116" y="64" width="60" height="10" rx="5" fill="#101916" fillOpacity="0.82" />
      <rect x="116" y="82" width="42" height="8" rx="4" fill="#0d7a57" fillOpacity="0.28" />
      {/* Smooth progress bar */}
      <rect x="60" y="114" width="120" height="8" rx="4" fill="#edf2ef" />
      <rect x="60" y="114" width="76" height="8" rx="4" fill="#0d7a57" />
    </svg>
  );
}

export function RewardsIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" role="img" aria-hidden="true">
      <rect x="20" y="18" width="200" height="144" rx="22" fill="#e5f6ef" />
      {/* Sunlit amber medal medallion */}
      <circle cx="120" cy="86" r="46" fill="#0d7a57" fillOpacity="0.1" />
      <circle cx="120" cy="86" r="34" fill="#0d7a57" />
      <path
        d="M120 66L125.6 77.4L138.2 79.2L129.1 88.1L131.2 100.6L120 94.7L108.8 100.6L110.9 88.1L101.8 79.2L114.4 77.4L120 66Z"
        fill="#fbbf24"
      />
      {/* Floating warm reward chips */}
      <circle cx="62" cy="60" r="10" fill="#fbbf24" />
      <circle cx="182" cy="112" r="12" fill="#e05232" fillOpacity="0.88" />
      <circle cx="176" cy="54" r="6" fill="#0d7a57" fillOpacity="0.45" />
      <circle cx="66" cy="122" r="7" fill="#0d7a57" fillOpacity="0.3" />
    </svg>
  );
}
