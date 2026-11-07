import React from 'react';

/**
 * Reusable shimmer loading skeleton component.
 * Matches card shapes to avoid blank flashes.
 */
export default function Skeleton({ width, height, rounded = 'md', className = '' }) {
  const radiusMap = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
    none: '',
  };
  const r = radiusMap[rounded] || 'rounded-xl';

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
    <div className={`bg-white rounded-3xl border border-border/80 p-5 space-y-3.5 shadow-card ${className}`} aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton width="44px" height="44px" rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton width="55%" height="14px" rounded="full" />
          <Skeleton width="35%" height="11px" rounded="full" />
        </div>
        <Skeleton width="68px" height="22px" rounded="full" />
      </div>
      <Skeleton width="100%" height="36px" rounded="lg" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton width="40%" height="12px" rounded="full" />
        <Skeleton width="64px" height="24px" rounded="full" />
      </div>
    </div>
  );
}

/** Skeleton hero card — mimics points/status hero while loading */
export function SkeletonHero({ className = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-border/80 p-6 space-y-4 shadow-card ${className}`} aria-hidden="true">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2.5 flex-1">
          <Skeleton width="90px" height="12px" rounded="full" />
          <Skeleton width="140px" height="36px" rounded="lg" />
          <Skeleton width="120px" height="24px" rounded="full" />
        </div>
        <Skeleton width="96px" height="96px" rounded="full" />
      </div>
      <Skeleton width="100%" height="10px" rounded="full" />
    </div>
  );
}

/** Skeleton for map placeholder */
export function SkeletonMap({ className = '' }) {
  return (
    <div className={`flex-1 animate-shimmer relative overflow-hidden ${className}`} style={{ minHeight: '300px' }} aria-hidden="true">
      <div className="absolute top-4 left-4 right-4 flex gap-2">
        <div className="h-9 w-24 rounded-full bg-white/70" />
        <div className="h-9 w-28 rounded-full bg-white/70" />
        <div className="h-9 w-24 rounded-full bg-white/70" />
      </div>
    </div>
  );
}
