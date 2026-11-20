import React from 'react';
import { useTranslation } from 'react-i18next';
import CountUp from '../ui/CountUp';
import ContributionIllustration from './ContributionIllustration';

const formatKg = (value) =>
  Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 1 });

/**
 * Hero card: total kg contributed (count-up), three small stats and an illustration.
 * New contributors see 0 kg plus a "Schedule your first pickup" call to action.
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
      className="relative overflow-hidden rounded-2xl bg-primary-light border border-primary/15 p-5"
    >
      {/* Soft decorative circle behind the illustration */}
      <span aria-hidden="true" className="absolute -right-8 -top-8 size-44 rounded-full bg-white/45" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 id="home-contribution-title" className="text-sm font-bold text-primary-dark text-balance">
            {t('home_contribution_title')}
          </h2>
          <p className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[52px] leading-none font-extrabold text-ink tabular">
              <CountUp value={summary.totalKg} />
            </span>
            <span className="text-sm font-semibold text-primary-dark">{t('home_kg_contributed')}</span>
          </p>

          {isNewUser && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-bold text-ink text-balance">{t('home_no_pickup_title')}</p>
                <p className="text-xs text-muted text-pretty mt-0.5 leading-snug">{t('home_contribution_empty_text')}</p>
              </div>
              <button
                type="button"
                onClick={onSchedule}
                className="min-h-11 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('home_no_pickup_cta')}
              </button>
            </div>
          )}
        </div>

        <div className="w-[38%] max-w-[160px] shrink-0 -mt-1">
          <ContributionIllustration />
        </div>
      </div>

      {/* Three small stats */}
      <dl className="relative mt-5 grid grid-cols-3 gap-2">
        {stats.map(stat => (
          <div key={stat.id} className="rounded-xl bg-white/85 border border-primary/10 px-3 py-2.5">
            <dd className="text-lg font-bold text-ink tabular leading-tight">{stat.value}</dd>
            <dt className="text-[11px] text-muted leading-tight mt-0.5">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
