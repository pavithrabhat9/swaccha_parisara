import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Button — Tactile consumer button primitive.
 * Variants: primary | secondary | ghost | soft | danger | inverse
 * Sizes: sm (36px) | md (44px) | lg (48px)
 */
const VARIANTS = {
  primary:
    'bg-primary text-white shadow-[0_4px_14px_-2px_rgba(13,122,87,0.34)] hover:bg-primary-dark hover:shadow-[0_6px_18px_-2px_rgba(13,122,87,0.42)]',
  secondary:
    'bg-white text-ink shadow-xs border border-border/80 hover:bg-sunken/60',
  ghost:
    'bg-transparent text-muted hover:text-ink hover:bg-sunken',
  soft:
    'bg-primary-light text-primary-dark hover:bg-primary/15',
  danger:
    'bg-orange-red-light text-orange-red-dark hover:bg-orange-red/15',
  inverse:
    'bg-white text-primary-dark shadow-xs hover:bg-primary-lighter',
};

const SIZES = {
  sm: 'min-h-9 px-3.5 text-xs gap-1.5 rounded-xl',
  md: 'min-h-11 px-4 text-sm gap-2 rounded-xl',
  lg: 'min-h-12 px-5 text-body gap-2 rounded-xl',
};

export function Spinner({ className = 'size-4' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block rounded-full border-2 border-current border-r-transparent animate-spin opacity-80',
        className
      )}
    />
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center font-bold select-none whitespace-nowrap cursor-pointer',
        'transition-[transform,opacity,background-color,box-shadow] duration-150 ease-out active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      <span className="block">{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
