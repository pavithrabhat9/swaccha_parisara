import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Card — Soft-elevated consumer surface.
 * Uses ambient depth rather than heavy wireframe borders.
 */
const TONES = {
  default: 'card-elevated',
  sunken: 'bg-sunken',
  tint: 'bg-primary-lighter',
  primary: 'surface-hero-emerald text-white',
  outline: 'bg-white border border-border',
};

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({
  as: Tag = 'div',
  tone = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn(
        'relative rounded-2xl overflow-hidden',
        TONES[tone] || TONES.default,
        PADDING[padding] ?? PADDING.md,
        interactive && 'hover-lift press-scale cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
