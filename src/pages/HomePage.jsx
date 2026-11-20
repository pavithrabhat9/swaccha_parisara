import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHome } from '../hooks/useHome';
import HomeGreetingRow from '../components/home/HomeGreetingRow';
import ContributionCard from '../components/home/ContributionCard';
import ScheduledPickupCard from '../components/home/ScheduledPickupCard';
import LearnCarousel from '../components/home/LearnCarousel';
import VideoModal from '../components/home/VideoModal';
import { HomeLeftSkeleton, HomeLearnSkeleton } from '../components/home/HomeSkeleton';
import BottomMist from '../components/layout/BottomMist';
import ErrorState from '../components/ui/ErrorState';
import { ChevronRightIcon, TruckIcon } from '../components/ui/Icons';

function SectionHeader({ id, title, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-base font-extrabold text-ink text-balance">{title}</h2>
      <button
        type="button"
        onClick={onAction}
        className="min-h-11 pl-3 -mr-1 text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      >
        {actionLabel}
        <ChevronRightIcon className="size-3.5" />
      </button>
    </div>
  );
}

/**
 * HomePage — greeting row (rewards pill + notification inbox), contribution card,
 * scheduled pickups, Learn highlights and the bottom mist.
 * Mobile: single column. Desktop: left = contribution + pickups, right = Learn grid.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const home = useHome();
  const [activeVideo, setActiveVideo] = useState(null);

  const visiblePickups = home.upcoming.slice(0, 2);

  const handleOpenLearnItem = (item) => {
    if (item.kind === 'video') {
      setActiveVideo(item);
    } else {
      navigate('/learn');
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 md:pt-8 pb-14 md:pb-8">
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-6 md:items-start">
          {/* 1. Greeting row */}
          <div className="md:col-span-12">
            <HomeGreetingRow
              greetingKey={home.greetingKey}
              firstName={home.firstName}
              initials={home.initials}
              points={home.summary?.points ?? 0}
              notifications={home.notifications}
              unreadCount={home.unreadCount}
              onMarkAllRead={home.markAllRead}
              onMarkRead={home.markRead}
            />
          </div>

          {home.error ? (
            <div className="md:col-span-12">
              <ErrorState
                title={t('ui_error_default_title')}
                description={t('ui_error_default_description')}
                retryLabel={t('ui_error_try_again')}
                onRetry={home.retry}
              />
            </div>
          ) : home.loading ? (
            <>
              <div className="md:col-span-7">
                <HomeLeftSkeleton />
              </div>
              <div className="md:col-span-5">
                <HomeLearnSkeleton />
              </div>
            </>
          ) : (
            <>
              {/* 2 + 3. Contribution card and scheduled pickups */}
              <div className="md:col-span-7 space-y-6">
                <ContributionCard
                  summary={home.summary}
                  isNewUser={home.isNewUser}
                  onSchedule={() => navigate('/pickup?tab=home&start=1')}
                />

                <section aria-labelledby="home-scheduled-title" className="space-y-3">
                  <h2 id="home-scheduled-title" className="text-base font-extrabold text-ink text-balance">
                    {t('home_scheduled_title')}
                  </h2>

                  {visiblePickups.length > 0 ? (
                    <div className="space-y-3">
                      {visiblePickups.map(item => (
                        <ScheduledPickupCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white border border-dashed border-border p-6 text-center space-y-3">
                      <span
                        aria-hidden="true"
                        className="mx-auto size-12 rounded-full bg-primary-light text-primary flex items-center justify-center"
                      >
                        <TruckIcon className="size-6" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink text-balance">{t('home_scheduled_empty_title')}</p>
                        <p className="text-xs text-muted text-pretty mt-1">{t('home_scheduled_empty_text')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/pickup?tab=home&start=1')}
                        className="min-h-11 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        {t('home_no_pickup_cta')}
                      </button>
                    </div>
                  )}
                </section>
              </div>

              {/* 4. Learn */}
              <section aria-labelledby="home-learn-title" className="md:col-span-5 space-y-3">
                <SectionHeader
                  id="home-learn-title"
                  title={t('home_learn_title')}
                  actionLabel={t('home_view_all')}
                  onAction={() => navigate('/learn')}
                />
                <LearnCarousel items={home.learn} onOpenItem={handleOpenLearnItem} />
              </section>

              <p className="md:col-span-12 text-center text-[11px] text-muted-light">
                {t('sample_data_note')}
              </p>
            </>
          )}
        </div>
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      {/* 5. Bottom mist above the bar */}
      <BottomMist />
    </>
  );
}
