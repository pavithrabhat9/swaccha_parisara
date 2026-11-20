import React, { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import { cn } from '../../utils/cn';

/**
 * ProgressRing — circular progress (0–100) with centered content.
 * trackClass / barClass accept Tailwind stroke utilities.
 */
export default function ProgressRing({
  value = 0,
  size = 112,
  stroke = 10,
  trackClass = 'stroke-border',
  barClass = 'stroke-primary',
  label,
  children,
  className = '',
}) {
  const reduced = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const [shown, setShown] = useState(reduced ? clamped : 0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (shown / 100) * c;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0 tabular', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={trackClass} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={barClass}
          style={{ transition: reduced ? 'none' : 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
