import React from 'react';

/**
 * Chip — selectable pill (filters, tags, single/multi choice).
 * size: sm (32px) | md (40px) | lg (48px, for primary choices like waste type)
 * variant: solid (default) | glass (for floating over the map)
 * Active state uniformly uses brand primary green (#38761d).
 */
const SIZES = {
  sm: 'h-8 px-3.5 text-caption gap-1.5',
  md: 'h-10 px-4 text-body-sm gap-2',
  lg: 'h-12 px-5 text-body-sm gap-2',
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
        ? 'bg-primary text-white border-primary shadow-pill'
        : 'bg-white/95 glass text-black border-border/80 shadow-card hover:border-primary/40 hover:text-primary'
      : selected
        ? 'bg-primary text-white border-primary shadow-pill'
        : 'bg-white text-black border-border hover:border-primary/40 hover:bg-primary-lighter hover:text-primary';

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`
        inline-flex items-center justify-center shrink-0 rounded-full border font-semibold
        whitespace-nowrap select-none cursor-pointer
        transition-[background-color,border-color,color,box-shadow,transform] duration-200
        active:scale-[0.96]
        ${SIZES[size] || SIZES.md}
        ${base}
        ${className}
      `}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
