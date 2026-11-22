import React from 'react';
import { cn } from '../../utils/cn';

/**
 * ResinCodeIcon — Reusable standard resin identification code symbol (1 to 7):
 * three chasing arrows forming a triangle with the resin code number centered inside.
 *
 * Color tones:
 * - `green` (default): brand green `#38761d` for white surfaces.
 * - `dark`: charcoal black `#101916` for light/tinted surfaces.
 * - `current`: inherits `currentColor`.
 */
export default function ResinCodeIcon({
  code,
  size = 32,
  tone = 'green',
  className = '',
  decorative = true,
}) {
  const numericCode = Number(code);
  const displayCode = numericCode >= 1 && numericCode <= 7 ? String(numericCode) : '?';

  const toneClass =
    tone === 'dark'
      ? 'text-[#101916]'
      : tone === 'current'
        ? 'text-current'
        : 'text-[#38761d]';

  // Keep strokes crisp at small sizes (20-24px) while staying refined at large sizes (40-48px)
  const strokeWidth = size <= 24 ? 4.4 : size <= 32 ? 3.8 : 3.3;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('inline-block shrink-0', toneClass, className)}
      aria-hidden={decorative ? 'true' : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `Resin identification code ${displayCode}`}
    >
      <g transform="translate(0 4)">
        {/* Top-right chasing arrow */}
        <path
          d="M23.5 18.5 L30.2 7.8 Q32 5 33.8 7.8 L41.5 20.2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.5 18.4 L41.8 20.5 L43.4 13.8"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-right chasing arrow */}
        <path
          d="M46.2 28 L54.2 41.2 Q55.8 44 52.6 44 L38.2 44"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42.6 39.2 L37.8 44 L42.6 48.8"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-left chasing arrow */}
        <path
          d="M25.8 44 L11.4 44 Q8.2 44 9.8 41.2 L17.6 28.2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.2 29.8 L17.9 27.8 L19.6 34.2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Centered resin code numeral (1–7) */}
        <text
          x="32"
          y="37.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize="19"
          fontWeight="800"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          {displayCode}
        </text>
      </g>
    </svg>
  );
}

