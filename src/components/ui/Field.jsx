import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Form field primitives: Field (label/hint/error wrapper), TextInput, TextArea, Select.
 * Inputs are 48px tall, sunken surface, green focus ring.
 */

const inputBase =
  'w-full bg-sunken text-ink text-body placeholder:text-muted-light ' +
  'border border-border rounded-xl ' +
  'hover:border-primary/40 ' +
  'focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ' +
  'disabled:opacity-60';

const invalidRing = 'border-orange-red/70 bg-orange-red-light/30 focus:border-orange-red focus:ring-orange-red/20';

export function Field({ label, optional, required, hint, error, counter, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <div className="flex items-baseline justify-between mb-1.5">
          <label htmlFor={htmlFor} className="text-body-sm font-semibold text-ink">
            {label}
            {required && <span className="text-orange-red-dark ml-0.5" aria-hidden="true">*</span>}
            {optional && <span className="ml-1.5 text-caption font-medium text-muted">({optional})</span>}
          </label>
          {counter && <span className="text-caption text-muted tabular">{counter}</span>}
        </div>
      )}
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-caption font-semibold text-orange-red-dark flex items-center gap-1.5">
          <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-caption text-muted text-pretty">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ invalid, prefix, className = '', id, ...rest }) {
  const autoId = useId();
  const inputId = id || autoId;
  if (prefix) {
    return (
      <div className={cn('flex items-stretch rounded-xl', className)}>
        <span className="flex items-center px-3.5 bg-border-light rounded-l-xl text-body-sm font-semibold text-muted border border-r-0 border-border tabular">
          {prefix}
        </span>
        <input
          id={inputId}
          aria-invalid={invalid || undefined}
          className={cn(inputBase, 'h-12 px-3.5 rounded-l-none', invalid && invalidRing)}
          {...rest}
        />
      </div>
    );
  }
  return (
    <input
      id={inputId}
      aria-invalid={invalid || undefined}
      className={cn(inputBase, 'h-12 px-3.5', invalid && invalidRing, className)}
      {...rest}
    />
  );
}

export function TextArea({ invalid, className = '', ...rest }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(inputBase, 'px-3.5 py-3 resize-none leading-relaxed', invalid && invalidRing, className)}
      {...rest}
    />
  );
}

/** Styled native select — keeps native mobile pickers and accessibility. */
export function Select({ invalid, className = '', children, leftIcon, ...rest }) {
  return (
    <div className={cn('relative', className)}>
      {leftIcon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none">{leftIcon}</span>
      )}
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          inputBase,
          'h-12 pr-10 appearance-none cursor-pointer font-medium',
          leftIcon ? 'pl-10' : 'pl-3.5',
          invalid && invalidRing
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
