import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHome } from '../hooks/useHome';
import { useToast } from '../components/ui/Toast';
import HomeGreetingRow from '../components/home/HomeGreetingRow';
import ContributionCard from '../components/home/ContributionCard';
import ScheduledPickupCard from '../components/home/ScheduledPickupCard';
import LearnCarousel from '../components/home/LearnCarousel';
import VideoModal from '../components/home/VideoModal';
import { HomeLeftSkeleton, HomeLearnSkeleton } from '../components/home/HomeSkeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { ChevronRightIcon } from '../components/ui/Icons';

function SectionHeader({ id, title, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-base font-extrabold text-ink tracking-tight text-balance">{title}</h2>
      <button
        type="button"
        onClick={onAction}
        className="min-h-9 px-2.5 -mr-1 text-xs font-bold text-primary hover:text-primary-dark hover:bg-primary-light/60 inline-flex items-center gap-0.5 cursor-pointer rounded-xl transition-colors duration-150"
      >
        <span>{actionLabel}</span>
        <ChevronRightIcon className="size-3.5" />
      </button>
    </div>
  );
}

/**
 * HomePage — Civic Recovery & Collection Operations Dashboard.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const home = useHome();
  const { resolveNotificationTarget } = home;
  const [activeVideo, setActiveVideo] = useState(null);

  const visiblePickups = home.upcoming.slice(0, 2);

  const handleOpenLearnItem = useCallback((item) => {
    if (item.kind === 'video') {
      setActiveVideo(item);
    } else {
      navigate(`/learn?guide=${encodeURIComponent(item.id)}`);
    }
  }, [navigate]);

  const handleSelectNotification = useCallback(async (notif) => {
    if (!notif) return;
    const { path, missing } = await resolveNotificationTarget(notif);
    if (missing) {
      showToast(t('home_notif_target_missing'), 'info', 3000);
    }
    if (path) {
      navigate(path);
    }
  }, [resolveNotificationTarget, navigate, showToast, t]);

  return (
    <>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6 md:py-8"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)' }}
      >
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-6 md:items-start">
          {/* 1. Resident Greeting Row */}
          <div className="md:col-span-12">
            <HomeGreetingRow
              greetingKey={home.greetingKey}
              firstName={home.firstName}
              initials={home.initials}
              avatarUrl={home.avatarUrl}
              points={home.summary?.points ?? 0}
              notifications={home.notifications}
              unreadCount={home.unreadCount}
              onMarkAllRead={home.markAllRead}
              onMarkRead={home.markRead}
              onDeleteNotification={home.deleteNotification}
              onSelectNotification={handleSelectNotification}
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
              {/* 2 + 3. Recovery Ledger + Collection Dockets */}
              <div className="md:col-span-7 space-y-6">
                <ContributionCard
                  summary={home.summary}
                  isNewUser={home.isNewUser}
                  onSchedule={() => navigate('/pickup?tab=home&start=1')}
                />

                <section aria-labelledby="home-scheduled-title" className="space-y-3">
                  <SectionHeader
                    id="home-scheduled-title"
                    title={t('home_scheduled_title')}
                    actionLabel={t('pickup')}
                    onAction={() => navigate('/pickup')}
                  />

                  {visiblePickups.length > 0 ? (
                    <div className="space-y-2.5">
                      {visiblePickups.map((item) => (
                        <ScheduledPickupCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title={t('home_scheduled_empty_title')}
                      description={t('home_scheduled_empty_text')}
                      actionLabel={t('home_no_pickup_cta')}
                      onAction={() => navigate('/pickup?tab=home&start=1')}
                    />
                  )}
                </section>
              </div>

              {/* 4. Reference & Segregation Guides (fault-isolated) */}
              <section aria-labelledby="home-learn-title" className="md:col-span-5 space-y-3">
                <SectionHeader
                  id="home-learn-title"
                  title={t('home_learn_title')}
                  actionLabel={t('home_view_all')}
                  onAction={() => navigate('/learn')}
                />
                {home.learnError ? (
                  <ErrorState
                    title={t('ui_error_default_title')}
                    description={t('ui_error_default_description')}
                    retryLabel={t('ui_error_try_again')}
                    onRetry={home.retry}
                  />
                ) : (
                  <LearnCarousel items={home.learn} onOpenItem={handleOpenLearnItem} />
                )}
              </section>

              <p className="md:col-span-12 pt-2 border-t border-border-light text-center font-mono-data text-[11px] text-muted-light">
                {t('sample_data_note')}
              </p>
            </>
          )}
        </div>
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
