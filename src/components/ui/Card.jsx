import React from 'react';

/**
 * Card — base surface.
 * tone: default (white) | sunken (soft inset) | tint (green wash) | primary (brand hero)
 * padding: none | sm | md | lg
 * interactive: adds hover lift + press feedback (use for tappable cards)
 */
const TONES = {
  default: 'bg-white border border-border/80 shadow-card',
  sunken: 'bg-sunken border border-border-light',
  tint: 'bg-primary-lighter border border-primary/10',
  primary:
    'bg-gradient-to-br from-primary via-primary-dark to-primary-deep text-white shadow-fab',
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
      className={`
        relative rounded-3xl overflow-hidden
        ${TONES[tone] || TONES.default}
        ${PADDING[padding] ?? PADDING.md}
        ${interactive ? 'hover-lift press-scale cursor-pointer' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </Tag>
  );
}

