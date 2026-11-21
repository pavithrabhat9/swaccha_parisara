import React from 'react';
import { useTranslation } from 'react-i18next';
import CountUp from '../ui/CountUp';
import ContributionIllustration from './ContributionIllustration';

const formatKg = (value) =>
  Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 1 });

/**
 * ContributionCard — Expressive emerald hero impact card.
 * Anchors the home dashboard with rich emerald depth, crisp white figures,
 * sunlit accent visual, and translucent stat tiles inside.
 */
export default function ContributionCard({ summary, isNewUser, onSchedule }) {
  const { t } = useTranslation();

  const stats = [
    { id: 'pickups', value: summary.pickupsCompleted.toLocaleString('en-IN'), label: t('home_stat_pickups') },
    { id: 'reports', value: summary.reportsMade.toLocaleString('en-IN'), label: t('home_stat_reports') },
    { id: 'month', value: formatKg(summary.kgThisMonth), label: t('home_stat_month') },
  ];

  return (
    <section
      aria-labelledby="home-contribution-title"
      className="relative rounded-2xl surface-hero-emerald text-white overflow-hidden"
    >
      {/* Subtle sunlit radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-12 size-56 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 id="home-contribution-title" className="text-sm font-semibold text-white/85 text-balance">
              {t('home_contribution_title')}
            </h2>

            <p className="mt-2 flex items-baseline gap-2.5 flex-wrap">
              <span className="tabular text-[44px] sm:text-[52px] leading-none font-extrabold text-white tracking-tight">
                <CountUp value={summary.totalKg} />
              </span>
              <span className="text-sm sm:text-base font-bold text-[#a7f3d0]">
                {t('home_kg_contributed')}
              </span>
            </p>

            {isNewUser && (
              <div className="mt-4 pt-4 border-t border-white/15 space-y-3">
                <div>
                  <p className="text-sm font-bold text-white text-balance">{t('home_no_pickup_title')}</p>
                  <p className="text-xs text-white/80 text-pretty mt-0.5 leading-relaxed">
                    {t('home_contribution_empty_text')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSchedule}
                  className="min-h-11 px-4 rounded-xl bg-white text-primary-dark text-xs font-extrabold hover:bg-primary-lighter transition-colors duration-150 cursor-pointer shadow-xs press-scale"
                >
                  {t('home_no_pickup_cta')}
                </button>
              </div>
            )}
          </div>

          <div className="hidden min-[380px]:block w-[132px] sm:w-[164px] aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-white/25 shrink-0">
            <ContributionIllustration />
          </div>
        </div>

        {/* Translucent embedded impact tiles */}
        <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map(stat => (
            <div
              key={stat.id}
              className="rounded-xl bg-white/12 px-3 py-2.5 sm:px-4 sm:py-3"
            >
              <dd className="tabular text-lg sm:text-xl font-extrabold text-white leading-tight">
                {stat.value}
              </dd>
              <dt className="text-[11px] font-medium text-white/80 leading-snug mt-0.5">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
