import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Button — the primary interactive button primitive.
 * Variants: primary | secondary | ghost | soft | danger | inverse
 * Sizes: sm (36px) | md (44px) | lg (48px)
 */
const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-dark',
  secondary:
    'bg-white text-ink border border-border hover:border-primary/40 hover:bg-primary-lighter',
  ghost:
    'bg-transparent text-muted hover:text-ink hover:bg-sunken',
  soft:
    'bg-primary-light text-primary-dark hover:bg-primary/20',
  danger:
    'bg-white text-orange-red-dark border border-orange-red/30 hover:bg-orange-red-light',
  inverse:
    'bg-white text-primary-dark border border-border hover:bg-primary-lighter',
};

const SIZES = {
  sm: 'min-h-9 px-3.5 text-caption gap-1.5 rounded-xl',
  md: 'min-h-11 px-5 text-body-sm gap-2 rounded-xl',
  lg: 'min-h-12 px-6 text-body gap-2 rounded-xl',
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
        'inline-flex items-center justify-center font-semibold select-none whitespace-nowrap cursor-pointer',
        'transition-[transform,opacity] duration-150 ease-out active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
