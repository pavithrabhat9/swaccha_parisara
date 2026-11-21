import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable loading skeleton component matching the architectural 10px card geometry.
 */
export default function Skeleton({ width, height, rounded = 'md', className = '' }) {
  const radiusMap = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-xl',
    full: 'rounded-full',
    none: '',
  };
  const r = radiusMap[rounded] || 'rounded-lg';

  return (
    <div
      className={cn('animate-shimmer', r, className)}
      style={{ width, height, minHeight: height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={cn('bg-white rounded-xl border border-border p-5 space-y-3.5', className)} aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton width="40px" height="40px" rounded="md" />
        <div className="flex-1 space-y-2">
          <Skeleton width="55%" height="14px" rounded="sm" />
          <Skeleton width="35%" height="11px" rounded="sm" />
        </div>
        <Skeleton width="68px" height="22px" rounded="sm" />
      </div>
      <Skeleton width="100%" height="36px" rounded="md" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton width="40%" height="12px" rounded="sm" />
        <Skeleton width="64px" height="24px" rounded="sm" />
      </div>
    </div>
  );
}

export function SkeletonHero({ className = '' }) {
  return (
    <div className={cn('bg-white rounded-xl border border-border p-6 space-y-4', className)} aria-hidden="true">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2.5 flex-1">
          <Skeleton width="90px" height="12px" rounded="sm" />
          <Skeleton width="140px" height="36px" rounded="md" />
          <Skeleton width="120px" height="20px" rounded="sm" />
        </div>
        <Skeleton width="120px" height="80px" rounded="md" />
      </div>
      <Skeleton width="100%" height="8px" rounded="sm" />
    </div>
  );
}

export function SkeletonMap({ className = '' }) {
  return (
    <div className={cn('flex-1 animate-shimmer relative overflow-hidden', className)} style={{ minHeight: '300px' }} aria-hidden="true">
      <div className="absolute top-4 left-4 right-4 flex gap-2">
        <div className="h-10 w-24 rounded-lg bg-white/80" />
        <div className="h-10 w-28 rounded-lg bg-white/80" />
      </div>
    </div>
  );
}
