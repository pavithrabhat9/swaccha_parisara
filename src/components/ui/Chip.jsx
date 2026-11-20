import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Chip — selectable pill (filters, tags, single/multi choice).
 * size: sm (36px) | md (44px) | lg (48px, for primary choices like waste type)
 * variant: solid (default) | glass (for floating over the map)
 * Active state uniformly uses brand primary green (#38761d).
 */
const SIZES = {
  sm: 'min-h-9 px-3.5 text-caption gap-1.5',
  md: 'min-h-11 px-4 text-body-sm gap-2',
  lg: 'min-h-12 px-5 text-body-sm gap-2',
};

export default function Chip({
  selected = false,
  size = 'md',
  variant = 'solid',
  icon,
  className = '',
  children,
  ...rest
}) {
  const base =
    variant === 'glass'
      ? selected
        ? 'bg-primary text-white border-primary'
        : 'bg-white/95 glass text-ink border-border hover:border-primary/40 hover:text-primary'
      : selected
        ? 'bg-primary text-white border-primary'
        : 'bg-white text-ink border-border hover:border-primary/40 hover:bg-primary-lighter hover:text-primary';

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center justify-center shrink-0 rounded-full border font-semibold',
        'whitespace-nowrap select-none cursor-pointer',
        'transition-[transform,opacity] duration-150 ease-out active:scale-[0.97]',
        SIZES[size] || SIZES.md,
        base,
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
