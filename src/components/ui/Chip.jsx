import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Chip — Tactile consumer filter/selection chip.
 */
const SIZES = {
  sm: 'min-h-9 px-3.5 text-xs gap-1.5',
  md: 'min-h-10 px-4 text-sm gap-2',
  lg: 'min-h-11 px-4 text-sm gap-2',
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
        ? 'bg-primary text-white shadow-sm'
        : 'bg-white/92 glass text-ink shadow-xs hover:bg-white'
      : selected
        ? 'bg-primary text-white shadow-[0_3px_10px_-2px_rgba(13,122,87,0.35)]'
        : 'bg-white text-ink shadow-xs hover:bg-primary-lighter hover:text-primary-dark';

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center justify-center shrink-0 rounded-xl font-semibold',
        'whitespace-nowrap select-none cursor-pointer',
        'transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.975]',
        SIZES[size] || SIZES.md,
        base,
        className
      )}
      {...rest}
    >
      {icon}
      <span className="block">{children}</span>
    </button>
  );
}
