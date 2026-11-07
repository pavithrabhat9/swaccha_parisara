import React from 'react';
import { useCountUp } from '../../hooks/useMotion';

/** CountUp — renders a number that animates up to `value` (locale formatted). */
export default function CountUp({ value, duration = 900, suffix = '', prefix = '', className = '' }) {
  const n = useCountUp(value, duration);
  return (
    <span className={`tabular ${className}`}>
      {prefix}
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

