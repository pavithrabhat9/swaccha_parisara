import React from 'react';
import { useTranslation } from 'react-i18next';
import CountUp from '../ui/CountUp';
import { BadgeMedal, StarIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

/**
 * PointsSummaryCard — Expressive sunlit emerald & marigold rewards hero card.
 */
export default function PointsSummaryCard({ points, tierProgress, className = '' }) {
  const { t } = useTranslation();
  const { tier, nextTier, progressPercent, pointsToNext } = tierProgress;

  return (
    <section className={cn('relative rounded-2xl surface-hero-emerald text-white overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-10 size-44 rounded-full bg-yellow/20 blur-2xl"
      />

      <div className="relative p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-white/80 inline-flex items-center gap-1.5">
              <StarIcon className="size-3.5 text-yellow" />
              {t('yourPoints')}
            </p>
            <p className="tabular text-4xl font-extrabold text-white mt-1.5 tracking-tight leading-none">
              <CountUp value={points} />
            </p>
          </div>

          <div className="rounded-xl bg-white/14 px-3 py-2 flex items-center gap-2 shrink-0">
            <BadgeMedal id={tier.id} className="size-6 shrink-0" />
            <div className="text-left leading-tight">
              <p className="text-[10px] font-medium text-white/75">{t('tier_label')}</p>
              <p className="text-xs font-extrabold text-white mt-0.5">{tier.label}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/12 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-white/90 tabular">
              {nextTier
                ? t('tier_points_to_next', {
                    points: pointsToNext.toLocaleString('en-IN'),
                    tier: nextTier.label,
                  })
                : t('tier_top_reached')}
            </span>
            <span className="tabular text-yellow font-extrabold shrink-0">{progressPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-label={t('tier_label')}
            className="w-full h-2 bg-white/20 rounded-full overflow-hidden"
          >
            <div
              className="h-full w-full bg-yellow origin-left rounded-full transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${Math.max(0, Math.min(100, progressPercent)) / 100})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
