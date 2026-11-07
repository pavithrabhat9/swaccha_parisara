import React, { useId } from 'react';

/**
 * Form field primitives: Field (label/hint/error wrapper), TextInput, TextArea, Select.
 * Inputs are 48px tall, sunken surface, green focus ring.
 */

const inputBase = `
  w-full bg-sunken text-ink text-body placeholder:text-muted-light
  border border-transparent rounded-2xl
  transition-[border-color,box-shadow,background-color] duration-200
  hover:border-border
  focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/12
  disabled:opacity-60
`;

const invalidRing = 'border-orange-red/60 bg-orange-red-light/40 focus:border-orange-red focus:ring-orange-red/12';

export function Field({ label, optional, required, hint, error, counter, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor={htmlFor} className="text-body-sm font-semibold text-ink">
            {label}
            {required && <span className="text-orange-red ml-0.5" aria-hidden="true">*</span>}
            {optional && <span className="ml-1.5 text-caption font-medium text-muted-light">{optional}</span>}
          </label>
          {counter && <span className="text-caption text-muted-light tabular">{counter}</span>}
        </div>
      )}
      {children}
      {error ? (
        <p role="alert" className="mt-2 text-caption font-medium text-orange-red-dark flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-caption text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ invalid, prefix, className = '', id, ...rest }) {
  const autoId = useId();
  const inputId = id || autoId;
  if (prefix) {
    return (
      <div className={`flex items-stretch rounded-2xl ${className}`}>
        <span className="flex items-center px-4 bg-border-light rounded-l-2xl text-body font-semibold text-muted border border-r-0 border-transparent">
          {prefix}
        </span>
        <input
          id={inputId}
          aria-invalid={invalid || undefined}
          className={`${inputBase} h-12 px-4 rounded-l-none ${invalid ? invalidRing : ''}`}
          {...rest}
        />
      </div>
    );
  }
  return (
    <input
      id={inputId}
      aria-invalid={invalid || undefined}
      className={`${inputBase} h-12 px-4 ${invalid ? invalidRing : ''} ${className}`}
      {...rest}
    />
  );
}

export function TextArea({ invalid, className = '', ...rest }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`${inputBase} px-4 py-3.5 resize-none leading-relaxed ${invalid ? invalidRing : ''} ${className}`}
      {...rest}
    />
  );
}

/** Styled native select — keeps native mobile pickers and accessibility. */
export function Select({ invalid, className = '', children, leftIcon, ...rest }) {
  return (
    <div className={`relative ${className}`}>
      {leftIcon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">{leftIcon}</span>
      )}
      <select
        aria-invalid={invalid || undefined}
        className={`${inputBase} h-12 pr-11 ${leftIcon ? 'pl-11' : 'pl-4'} appearance-none cursor-pointer font-medium ${invalid ? invalidRing : ''}`}
        {...rest}
      >
        {children}
      </select>
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

