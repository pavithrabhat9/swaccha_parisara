import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Card — base surface (16px radius, single elevation declaration: border or fill).
 * tone: default (white + border) | sunken (soft inset) | tint (green wash) | primary (solid brand hero)
 * padding: none | sm | md | lg
 * interactive: adds hover lift + press feedback (use for tappable cards)
 */
const TONES = {
  default: 'bg-white border border-border',
  sunken: 'bg-sunken border border-border-light',
  tint: 'bg-primary-lighter border border-primary/15',
  primary: 'bg-primary text-white',
  outline: 'bg-white border border-border',
};

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 md:p-7',
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
