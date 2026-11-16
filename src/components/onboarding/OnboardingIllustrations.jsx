import React from 'react';

/**
 * Onboarding illustrations — simple inline SVGs drawn only with the app palette:
 * green #38761d (+ tints/shades), yellow #fab328, white, ink, with orange-red unused here.
 */

const GROUND = <ellipse cx="120" cy="180" rx="86" ry="9" fill="#e3eedd" />;

export function ReportIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 240 200" fill="none" role="img" aria-hidden="true">
      {GROUND}
      {/* Map card */}
      <rect x="32" y="40" width="176" height="122" rx="12" fill="#f2f7ef" stroke="#e4e9e1" strokeWidth="2" />
      <rect x="44" y="52" width="40" height="28" rx="6" fill="#e3eedd" />
      <path d="M32 90H208M32 128H208M92 40V162M156 40V162" stroke="#e4e9e1" strokeWidth="2" />
      <path d="M44 152C90 122 140 134 196 72" stroke="#e3eedd" strokeWidth="10" strokeLinecap="round" />
      {/* Pin */}
      <ellipse cx="120" cy="109" rx="13" ry="4" fill="#10180c" opacity="0.12" />
      <path d="M120 36c-17 0-28 12-28 27 0 20 28 44 28 44s28-24 28-44c0-15-11-27-28-27z" fill="#38761d" />
      <circle cx="120" cy="63" r="11" fill="#ffffff" />
      {/* Plastic bottle */}
      <g transform="translate(166 104)">
        <rect x="0" y="18" width="26" height="48" rx="8" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="7" y="6" width="12" height="14" rx="3" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
        <rect x="6" y="0" width="14" height="7" rx="2" fill="#fab328" />
        <rect x="1.25" y="34" width="23.5" height="14" fill="#e3eedd" />
      </g>
      <circle cx="54" cy="136" r="6" fill="#fab328" />
    </svg>
  );
}

export function PickupIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 240 200" fill="none" role="img" aria-hidden="true">
      {GROUND}
      {/* House */}
      <rect x="44" y="96" width="84" height="66" rx="4" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
      <path d="M34 101L86 54l52 47z" fill="#38761d" />
      <rect x="54" y="108" width="16" height="16" rx="2" fill="#e3eedd" />
      <rect x="102" y="108" width="16" height="16" rx="2" fill="#e3eedd" />
      <rect x="76" y="124" width="20" height="38" rx="3" fill="#e3eedd" stroke="#38761d" strokeWidth="2" />
      {/* Bag waiting at the door */}
      <path d="M140 162v-34q0-8 8-8h22q8 0 8 8v34z" fill="#fab328" stroke="#10180c" strokeWidth="2" />
      <path d="M150 120q10-14 20 0" stroke="#10180c" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="152" y="134" width="16" height="10" rx="2" fill="#ffffff" opacity="0.75" />
      {/* Schedule badge */}
      <rect x="162" y="38" width="46" height="44" rx="8" fill="#ffffff" stroke="#38761d" strokeWidth="2.5" />
      <path d="M162 54v-8a8 8 0 0 1 8-8h30a8 8 0 0 1 8 8v8z" fill="#38761d" />
      <path d="M175 69l6 6 12-12" stroke="#38761d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RewardsIllustration({ className = 'w-full h-full' }) {
  return (
    <svg className={className} viewBox="0 0 240 200" fill="none" role="img" aria-hidden="true">
      {GROUND}
      {/* Ribbon tails */}
      <path d="M94 108L80 164l18-9 10 15 14-54z" fill="#38761d" />
      <path d="M146 108l14 56-18-9-10 15-14-54z" fill="#2a5a15" />
      {/* Medal */}
      <circle cx="120" cy="84" r="46" fill="#fab328" stroke="#38761d" strokeWidth="3" />
      <circle cx="120" cy="84" r="34" fill="#fef4dc" stroke="#fab328" strokeWidth="2" />
      <polygon points="120,64 126,78 141,79 130,89 133,104 120,96 107,104 110,89 99,79 114,78" fill="#38761d" />
      {/* Leaf + sparkles */}
      <path d="M40 126c0-18 14-30 30-30 0 18-12 30-30 30z" fill="#e3eedd" stroke="#38761d" strokeWidth="2" />
      <circle cx="194" cy="52" r="8" fill="#fab328" />
      <circle cx="206" cy="108" r="4" fill="#38761d" />
      <circle cx="40" cy="60" r="4" fill="#fab328" />
    </svg>
  );
}

