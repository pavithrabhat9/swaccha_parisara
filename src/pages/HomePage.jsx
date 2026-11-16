import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHome } from '../hooks/useHome';
import PointsSummaryCard from '../components/rewards/PointsSummaryCard';
import ActivePickupCard from '../components/pickup/ActivePickupCard';
import OpenStatusBadge from '../components/pickup/OpenStatusBadge';
import CountUp from '../components/ui/CountUp';
import ErrorState from '../components/ui/ErrorState';
import Skeleton, { SkeletonCard, SkeletonHero } from '../components/ui/Skeleton';
import {
  CameraIcon,
  PlusIcon,
  TrashIcon,
  BookIcon,
  LeafIcon,
  MapPinIcon,
  ChevronRightIcon,
} from '../components/ui/Icons';

const QUICK_ACTIONS = [
  { id: 'scan', labelKey: 'home_action_scan', Icon: CameraIcon, to: '/pickup?tab=home&start=1' },
  { id: 'report', labelKey: 'home_action_report', Icon: PlusIcon, to: '/report' },
  { id: 'trash-bank', labelKey: 'home_action_trash_bank', Icon: TrashIcon, to: '/pickup?tab=trash-bank' },
  { id: 'learn', labelKey: 'home_action_learn', Icon: BookIcon, to: '/learn' },
];

const SECTION = 'border border-border rounded-[8px] bg-white p-5';
const SECTION_TITLE = 'text-[11px] font-semibold text-muted uppercase tracking-wider';

/**
 * HomePage — greeting, points, next pickup, quick actions, impact, tip of the day, nearby drop point.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const home = useHome();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-black tracking-tight">
          {t('home_greeting', { name: home.firstName })}
        </h1>
        <p className="text-xs text-muted mt-0.5">
          {home.locality ? `${home.locality} · ` : ''}{t('home_subtitle')}
        </p>
      </div>

      {home.loading ? (
        <div className="space-y-6" aria-busy="true">
          <div className="grid md:grid-cols-2 gap-6">
            <SkeletonHero />
            <SkeletonCard />
          </div>
          <Skeleton width="100%" height="84px" rounded="sm" />
          <div className="grid md:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : home.error ? (
        <ErrorState
          title={t('ui_error_default_title')}
          description={t('ui_error_default_description')}
          retryLabel={t('ui_error_try_again')}
          onRetry={home.retry}
        />
      ) : (
        <>
          {/* Points + next pickup */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <PointsSummaryCard points={home.points} tierProgress={home.tierProgress} />

            {home.activePickup ? (
              <ActivePickupCard
                pickup={home.activePickup}
                title={t('home_next_pickup_title')}
                actionLabel={t('home_view_pickup')}
                onAction={() => navigate('/pickup?tab=home')}
              />
            ) : (
              <section className={`${SECTION} space-y-3`}>
                <p className={SECTION_TITLE}>{t('home_next_pickup_title')}</p>
                <div>
                  <h2 className="text-sm font-bold text-black">{t('home_no_pickup_title')}</h2>
                  <p className="text-xs text-muted mt-1">{t('home_no_pickup_text')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/pickup?tab=home&start=1')}
                  className="min-h-[44px] px-4 bg-primary text-white font-semibold rounded-[6px] text-sm hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  {t('home_no_pickup_cta')}
                </button>
              </section>
            )}
          </div>

          {/* Quick actions */}
          <section aria-labelledby="home-actions-title" className="space-y-3">
            <h2 id="home-actions-title" className={SECTION_TITLE}>{t('home_actions_title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map(({ id, labelKey, Icon, to }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(to)}
                  className="min-h-[44px] border border-border rounded-[8px] bg-white p-4 flex flex-col items-start gap-3 text-left hover:border-primary/40 transition-colors cursor-pointer press-scale"
                >
                  <span className="w-9 h-9 rounded-[6px] border border-border bg-sunken text-primary flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="text-sm font-semibold text-black">{t(labelKey)}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Impact + tip of the day */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <section className={`${SECTION} space-y-4`}>
              <h2 className={SECTION_TITLE}>{t('home_impact_title')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-black tracking-tight">
                    <CountUp value={home.totalKgDiverted} />
                    <span className="text-sm font-semibold text-muted ml-1">{t('home_kg')}</span>
                  </p>
                  <p className="text-xs text-muted mt-1">{t('home_impact_mine')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black tracking-tight">
                    <CountUp value={home.communityKg} />
                    <span className="text-sm font-semibold text-muted ml-1">{t('home_kg')}</span>
                  </p>
                  <p className="text-xs text-muted mt-1">{t('home_impact_community')}</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-light">{t('sample_data_note')}</p>
            </section>

            <section className={`${SECTION} space-y-2.5`}>
              <h2 className={`${SECTION_TITLE} inline-flex items-center gap-1.5`}>
                <LeafIcon className="w-3.5 h-3.5 text-primary" />
                {t('home_tip_title')}
              </h2>
              <p className="text-sm font-bold text-black">{home.tip.title}</p>
              <p className="text-xs text-muted leading-relaxed">{home.tip.text}</p>
              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="min-h-[44px] -ml-1 px-1 text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer"
              >
                {t('home_tip_cta')}
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </section>
          </div>

          {/* Nearby drop point teaser */}
          {home.nearbyDropPoint && (
            <section className={`${SECTION} space-y-3`}>
              <h2 className={SECTION_TITLE}>{t('home_nearby_title')}</h2>
              <button
                type="button"
                onClick={() => navigate(`/pickup?tab=trash-bank&center=${home.nearbyDropPoint.id}`)}
                className="w-full min-h-[44px] flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <span className="flex items-start gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-[6px] border border-border bg-sunken text-primary flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="min-w-0 space-y-1">
                    <span className="block text-sm font-bold text-black truncate">
                      {home.nearbyDropPoint.name}
                    </span>
                    <span className="block text-xs text-muted">
                      {home.nearbyDropPoint.area} · {t('distance_km', { km: home.nearbyDropPoint.distanceKm })}
                    </span>
                    <OpenStatusBadge point={home.nearbyDropPoint} />
                  </span>
                </span>
                <ChevronRightIcon className="w-4 h-4 text-muted shrink-0" />
              </button>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/pickup?tab=trash-bank')}
                  className="min-h-[44px] text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer"
                >
                  {t('home_nearby_cta')}
                </button>
                <span className="text-[11px] text-muted-light">{t('sample_data_note')}</span>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
