import React from 'react';

/**
 * Button — the one button primitive for the app.
 * Variants: primary | secondary | ghost | soft | danger | inverse
 * Sizes: sm (36px) | md (44px) | lg (52px)
 */
const VARIANTS = {
  primary:
    'bg-primary text-white shadow-fab hover:bg-primary-dark disabled:shadow-none',
  secondary:
    'bg-white text-ink border border-border shadow-xs hover:border-primary/40 hover:bg-primary-lighter',
  ghost:
    'bg-transparent text-muted hover:text-ink hover:bg-sunken',
  soft:
    'bg-primary-light text-primary-dark hover:bg-primary/15',
  danger:
    'bg-white text-orange-red-dark border border-orange-red/25 hover:bg-orange-red-light',
  inverse:
    'bg-white text-primary-dark shadow-card hover:bg-primary-lighter',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-caption gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-body-sm gap-2 rounded-2xl',
  lg: 'h-13 px-6 text-body gap-2 rounded-2xl',
};

export function Spinner({ className = 'w-4 h-4' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block rounded-full border-2 border-current border-r-transparent animate-spin opacity-80 ${className}`}
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
      className={`
        inline-flex items-center justify-center font-semibold select-none whitespace-nowrap
        transition-[background-color,border-color,color,box-shadow,transform] duration-200
        active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        cursor-pointer
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

