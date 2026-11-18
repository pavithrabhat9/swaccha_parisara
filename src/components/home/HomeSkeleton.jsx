import React from 'react';
import Skeleton from '../ui/Skeleton';

const CARD = 'rounded-[24px]';

/** Loading placeholders shaped like the Home cards (hero, pickup card, Learn carousel). */
export function HomeLeftSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-hidden="true">
      {/* Contribution hero */}
      <div className={`${CARD} bg-primary-light p-5 space-y-5`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3 flex-1">
            <Skeleton width="110px" height="14px" rounded="full" />
            <Skeleton width="150px" height="52px" rounded="lg" />
          </div>
          <Skeleton width="38%" height="110px" rounded="lg" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton width="100%" height="54px" rounded="lg" />
          <Skeleton width="100%" height="54px" rounded="lg" />
          <Skeleton width="100%" height="54px" rounded="lg" />
        </div>
      </div>

      {/* Scheduled pickups */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton width="140px" height="18px" rounded="full" />
          <Skeleton width="54px" height="14px" rounded="full" />
        </div>
        {[0, 1].map(i => (
          <div key={i} className={`${CARD} bg-white border border-border/60 shadow-card p-4 space-y-3`}>
            <div className="flex items-center gap-3">
              <Skeleton width="44px" height="44px" rounded="full" />
              <div className="flex-1 space-y-2">
                <Skeleton width="50%" height="14px" rounded="full" />
                <Skeleton width="35%" height="11px" rounded="full" />
              </div>
              <Skeleton width="72px" height="22px" rounded="full" />
            </div>
            <Skeleton width="70%" height="12px" rounded="full" />
            <Skeleton width="55%" height="12px" rounded="full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeLearnSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton width="70px" height="18px" rounded="full" />
        <Skeleton width="54px" height="14px" rounded="full" />
      </div>
      <div className="flex gap-3 overflow-hidden md:grid md:grid-cols-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`${CARD} bg-white border border-border/60 shadow-card overflow-hidden shrink-0 w-[236px] md:w-auto ${i === 2 ? 'hidden md:block' : ''}`}
          >
            <Skeleton width="100%" height="128px" rounded="none" />
            <div className="p-3.5 space-y-2">
              <Skeleton width="90%" height="14px" rounded="full" />
              <Skeleton width="40%" height="11px" rounded="full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

