import React from 'react';
import { useTranslation } from 'react-i18next';
import CountUp from '../ui/CountUp';
import { BadgeMedal } from '../ui/Icons';
import { cn } from '../../utils/cn';

/**
 * Points balance, current tier and progress to the next tier.
 * Shared by Home and Rewards.
 */
export default function PointsSummaryCard({ points, tierProgress, className = '' }) {
  const { t } = useTranslation();
  const { tier, nextTier, progressPercent, pointsToNext } = tierProgress;

  return (
    <section className={cn('border border-border rounded-2xl bg-white p-5 space-y-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted">{t('yourPoints')}</p>
          <p className="text-3xl font-bold text-ink tabular mt-1">
            <CountUp value={points} />
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-muted">{t('tier_label')}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            <BadgeMedal id={tier.id} className="size-5" />
            {tier.label}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border-light space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-ink tabular">
            {nextTier
              ? t('tier_points_to_next', {
                  points: pointsToNext.toLocaleString('en-IN'),
                  tier: nextTier.label,
                })
              : t('tier_top_reached')}
          </span>
          <span className="text-muted tabular shrink-0">{progressPercent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-label={t('tier_label')}
          className="w-full h-2 bg-sunken rounded-full overflow-hidden"
        >
          <div
            className="h-full w-full bg-primary origin-left transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${Math.max(0, Math.min(100, progressPercent)) / 100})` }}
          />
        </div>
      </div>
    </section>
  );
}
