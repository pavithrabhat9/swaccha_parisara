import React from 'react';
import { useTranslation } from 'react-i18next';
import CountUp from '../ui/CountUp';
import { BadgeMedal, StarIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

/**
 * PointsSummaryCard — Minimal emerald points & tier summary matching Home's ContributionCard.
 */
export default function PointsSummaryCard({ points, tierProgress, className = '' }) {
  const { t } = useTranslation();
  const { tier, nextTier, progressPercent, pointsToNext } = tierProgress;
  const clampedPercent = Math.max(0, Math.min(100, progressPercent));

  return (
    <section
      aria-label={t('yourPoints')}
      className={cn(
        'rounded-2xl surface-hero-emerald text-white overflow-hidden',
        className
      )}
    >
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/85 inline-flex items-center gap-1.5">
              <StarIcon className="size-3.5 text-yellow shrink-0" />
              <span>{t('yourPoints')}</span>
            </p>
            <p className="mt-1.5 flex items-baseline gap-2 flex-wrap">
              <span className="font-[family-name:var(--font-brand)] tabular text-[40px] sm:text-[48px] leading-none font-extrabold text-white tracking-[-0.025em]">
                <CountUp value={points} />
              </span>
              <span className="text-sm font-bold text-[#a7f3d0]">pts</span>
            </p>
          </div>

          <div className="rounded-xl bg-white/12 px-3 py-2 flex items-center gap-2.5 shrink-0">
            <BadgeMedal id={tier.id} className="size-7 shrink-0" />
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-white/75">{t('tier_label')}</p>
              <p className="text-xs font-bold text-white mt-0.5">{tier.label}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/15 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-white/90 tabular">
              {nextTier
                ? t('tier_points_to_next', {
                    points: pointsToNext.toLocaleString('en-IN'),
                    tier: nextTier.label,
                  })
                : t('tier_top_reached')}
            </span>
            <span className="tabular font-bold text-[#a7f3d0] shrink-0">
              {clampedPercent}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clampedPercent}
            aria-label={t('tier_label')}
            className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden"
          >
            <div
              className="h-full w-full bg-yellow origin-left rounded-full transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${clampedPercent / 100})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
