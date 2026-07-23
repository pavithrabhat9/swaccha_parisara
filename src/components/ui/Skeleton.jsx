import React from 'react';

/**
 * Reusable shimmer loading skeleton component.
 * Use in place of content that's loading to avoid blank flashes.
 */
export default function Skeleton({ width, height, rounded = 'md', className = '' }) {
  const radiusMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    none: '',
  };
  const r = radiusMap[rounded] || 'rounded-md';

  return (
    <div
      className={`animate-shimmer ${r} ${className}`}
      style={{ width, height, minHeight: height }}
      aria-hidden="true"
    />
  );
}

/** Skeleton card — mimics a typical content card while loading */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-surface rounded-xl p-4 space-y-3 shadow-card ${className}`}>
      <Skeleton width="60%" height="16px" rounded="full" />
      <Skeleton width="100%" height="12px" rounded="full" />
      <Skeleton width="80%" height="12px" rounded="full" />
      <div className="flex gap-2 pt-1">
        <Skeleton width="64px" height="24px" rounded="full" />
        <Skeleton width="48px" height="24px" rounded="full" />
      </div>
    </div>
  );
}

/** Skeleton for map placeholder */
export function SkeletonMap({ className = '' }) {
  return (
    <div className={`flex-1 animate-shimmer ${className}`} style={{ minHeight: '300px' }} />
  );
}
