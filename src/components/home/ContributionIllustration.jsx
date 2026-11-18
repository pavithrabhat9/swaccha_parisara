import React from 'react';

/**
 * Original flat illustration: a recycling bin with a few plastic bottles and a small yellow accent.
 * Palette only: green #38761d (+ shades/tints), white, yellow #fab328.
 */
export default function ContributionIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 160 140" fill="none" role="img" aria-hidden="true">
      <ellipse cx="80" cy="130" rx="54" ry="6" fill="#38761d" opacity="0.14" />

      {/* Bottle sticking out of the bin */}
      <g transform="translate(92 14) rotate(14)">
        <rect x="0" y="12" width="20" height="42" rx="7" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="5" y="3" width="10" height="11" rx="3" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="4" y="0" width="12" height="5" rx="2" fill="#fab328" />
        <rect x="1.25" y="26" width="17.5" height="11" fill="#e3eedd" />
      </g>

      {/* Bin body */}
      <path d="M44 58h72l-8 64q-0.7 6-7 6H59q-6.3 0-7-6z" fill="#38761d" />
      <path d="M44 58h72l-1.6 14H45.6z" fill="#2a5a15" opacity="0.55" />
      {/* Lid + handle */}
      <rect x="38" y="46" width="84" height="13" rx="6.5" fill="#2a5a15" />
      <rect x="68" y="38" width="24" height="9" rx="4.5" fill="#2a5a15" />

      {/* Leaf emblem */}
      <circle cx="80" cy="95" r="15" fill="#ffffff" />
      <path d="M71 101c0-9 6-15 17-15 0 9-6 15-17 15z" fill="#38761d" />
      <path d="M72 100c4-5 8-8 13-10" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

      {/* Bottle leaning on the left */}
      <g transform="translate(8 74) rotate(-12)">
        <rect x="0" y="14" width="22" height="46" rx="8" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="6" y="4" width="10" height="12" rx="3" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="5" y="0" width="12" height="6" rx="2" fill="#38761d" />
        <rect x="1.25" y="30" width="19.5" height="12" fill="#e3eedd" />
      </g>

      {/* Small bottle on the right */}
      <g transform="translate(124 86) rotate(10) scale(0.85)">
        <rect x="0" y="14" width="22" height="40" rx="8" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="6" y="4" width="10" height="12" rx="3" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="5" y="0" width="12" height="6" rx="2" fill="#fab328" />
        <rect x="1.25" y="26" width="19.5" height="10" fill="#e3eedd" />
      </g>

      {/* Yellow accent */}
      <circle cx="132" cy="34" r="5" fill="#fab328" />
      <circle cx="26" cy="40" r="3" fill="#38761d" opacity="0.5" />
    </svg>
  );
}

