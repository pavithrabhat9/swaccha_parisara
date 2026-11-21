import React from 'react';
import Skeleton from '../ui/Skeleton';

const CARD = 'rounded-xl';

/** Loading placeholders shaped like the Home ledger cards. */
export function HomeLeftSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-hidden="true">
      <div className={`${CARD} bg-white border border-border overflow-hidden`}>
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <Skeleton width="120px" height="14px" rounded="sm" />
            <Skeleton width="150px" height="44px" rounded="md" />
          </div>
          <Skeleton width="144px" height="96px" rounded="md" />
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-cream/60">
          {[0, 1, 2].map(i => (
            <div key={i} className="p-3.5 space-y-1.5">
              <Skeleton width="48px" height="18px" rounded="sm" />
              <Skeleton width="72%" height="11px" rounded="sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Skeleton width="140px" height="16px" rounded="sm" />
        {[0, 1].map(i => (
          <div key={i} className={`${CARD} bg-white border border-border p-4 flex items-center gap-3`}>
            <Skeleton width="40px" height="40px" rounded="md" />
            <div className="flex-1 space-y-2">
              <Skeleton width="50%" height="14px" rounded="sm" />
              <Skeleton width="35%" height="11px" rounded="sm" />
            </div>
            <Skeleton width="64px" height="32px" rounded="md" />
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
        <Skeleton width="72px" height="16px" rounded="sm" />
        <Skeleton width="54px" height="14px" rounded="sm" />
      </div>
      <div className={`${CARD} bg-white border border-border p-4 space-y-3`}>
        <Skeleton width="60%" height="16px" rounded="sm" />
        <Skeleton width="90%" height="12px" rounded="sm" />
        <Skeleton width="100%" height="36px" rounded="sm" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[0, 1].map(i => (
          <div key={i} className={`${CARD} bg-white border border-border overflow-hidden shrink-0 w-[236px]`}>
            <Skeleton width="100%" height="116px" rounded="none" />
            <div className="p-3.5 space-y-2">
              <Skeleton width="88%" height="14px" rounded="sm" />
              <Skeleton width="40%" height="11px" rounded="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
