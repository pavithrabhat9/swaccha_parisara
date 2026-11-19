import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRewards } from '../hooks/useRewards';
import { useToast } from '../components/ui/Toast';
import PointsSummaryCard from '../components/rewards/PointsSummaryCard';
import BottomMist from '../components/layout/BottomMist';
import { BADGE_CATEGORIES, DONATION_AMOUNTS } from '../data/mockRewards';
import { formatShortDate } from '../utils/dateUtils';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard, SkeletonHero } from '../components/ui/Skeleton';
import {
  BadgeMedal,
  CheckCircleIcon,
  LockIcon,
  HeartIcon,
  GiftIcon,
} from '../components/ui/Icons';

/**
 * RewardsPage — Stage 5:
 * 1. Balance card with tier progress
 * 2. Points history: earned, pending ("Awaiting weigh-in"), and donated entries
 * 3. Badges: categories Pickup, Report, Streak, Plastic type (unlocked + locked with unlock condition)
 * 4. Ranks: tabs "My area" and "By plastic type", top 10 list (first name + initial only), user's row highlighted
 * 5. Donate points: choose a sample NGO cause, amount selector, confirmation, entry appears in history
 * 6. Redemption: "Coming soon" card only (no cash, no payment)
 */
export default function RewardsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const {
    loading,
    error,
    reloadRewards,
    points,
    tierProgress,
    historyEntries,
    badges,
    causes,
    areaRanks,
    plasticTypeRanks,
    donatePoints,
  } = useRewards();

  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'earned' | 'pending' | 'donated'
  const [badgeCategory, setBadgeCategory] = useState('Pickup');
  const [rankTab, setRankTab] = useState('area'); // 'area' | 'plastic'
  const [selectedCauseId, setSelectedCauseId] = useState('cause-beach-cleanup');
  const [donationAmount, setDonationAmount] = useState(DONATION_AMOUNTS[0]);
  const [confirmingDonation, setConfirmingDonation] = useState(false);
  const [donateError, setDonateError] = useState('');

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6" aria-busy="true">
        <SkeletonHero />
        <div className="grid md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <ErrorState
          title={t('ui_error_default_title')}
          description={error}
          retryLabel={t('ui_error_try_again')}
          onRetry={reloadRewards}
        />
      </div>
    );
  }

  const filteredHistory = historyEntries.filter(item => {
    if (historyFilter === 'all') return true;
    return item.kind === historyFilter;
  });

  const filteredBadges = badges.filter(b => b.category === badgeCategory);
  const activeRanks = rankTab === 'area' ? areaRanks : plasticTypeRanks;
  const selectedCause = causes.find(c => c.id === selectedCauseId) || causes[0];

  const handleConfirmDonate = async () => {
    if (!selectedCause) return;
    setDonateError('');
    const result = await donatePoints({
      causeId: selectedCause.id,
      causeTitle: `${t(selectedCause.titleKey)} (Sample)`,
      amount: donationAmount,
    });
    if (!result.success) {
      setDonateError(result.error);
      return;
    }
    setConfirmingDonation(false);
    showToast(t('rewards_donate_success_toast'), 'success', 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14 md:py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-black tracking-tight">{t('rewards')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Balance Card, Badges, Donate Points, Redemption Coming Soon */}
        <div className="md:col-span-5 space-y-6">
          {/* 1. Balance card with tier progress */}
          <PointsSummaryCard points={points} tierProgress={tierProgress} />

          {/* 3. Badges by category: Pickup, Report, Streak, Plastic type */}
          <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
            <h2 className="text-sm font-bold text-black">{t('rewards_badges_title')}</h2>

            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('rewards_badges_title')}>
              {BADGE_CATEGORIES.map(cat => {
                const active = badgeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setBadgeCategory(cat.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-[6px] text-xs font-semibold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-primary text-white border-primary'
                        : 'bg-sunken text-black border-border hover:border-primary/40'
                    }`}
                  >
                    {t(cat.labelKey)}
                  </button>
                );
              })}
            </div>

            <div className="divide-y divide-border-light">
              {filteredBadges.map((item, idx) => (
                <div
                  key={`${item.category}-${idx}`}
                  className={`py-3 first:pt-1 last:pb-0 flex items-center gap-3 ${
                    item.unlocked ? '' : 'opacity-55 grayscale'
                  }`}
                >
                  <BadgeMedal id={item.id} locked={!item.unlocked} className="w-8 h-8 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-black truncate">{t(item.titleKey)}</p>
                    <p className="text-[11px] text-muted leading-snug mt-0.5">{t(item.descKey)}</p>
                  </div>
                  {item.unlocked ? (
                    <CheckCircleIcon className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <LockIcon className="w-3.5 h-3.5 text-muted shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Donate Points to NGO Causes */}
          <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-[6px] bg-primary-light text-primary flex items-center justify-center shrink-0">
                <HeartIcon className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-black">{t('rewards_donate_title')}</h2>
                <p className="text-xs text-muted mt-0.5">{t('rewards_donate_subtitle')}</p>
              </div>
            </div>

            {/* Cause selector */}
            <div className="space-y-2">
              {causes.map(cause => {
                const selected = selectedCause?.id === cause.id;
                return (
                  <button
                    key={cause.id}
                    type="button"
                    onClick={() => setSelectedCauseId(cause.id)}
                    className={`w-full p-3 rounded-[6px] border text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-primary bg-primary-lighter/60 ring-1 ring-primary'
                        : 'border-border bg-white hover:border-black/30'
                    }`}
                  >
                    <p className="text-xs font-bold text-black">{t(cause.titleKey)}</p>
                    <p className="text-[11px] text-muted mt-0.5">{t(cause.descKey)}</p>
                  </button>
                );
              })}
            </div>

            {/* Amount selector */}
            <div>
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
                {t('rewards_select_amount')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DONATION_AMOUNTS.map(amt => {
                  const selected = donationAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonationAmount(amt)}
                      className={`min-h-[40px] py-2 rounded-[6px] border text-xs font-bold tabular transition-colors cursor-pointer ${
                        selected
                          ? 'border-primary text-primary bg-white ring-1 ring-primary'
                          : 'border-border text-black bg-white hover:border-black/30'
                      }`}
                    >
                      {amt} pts
                    </button>
                  );
                })}
              </div>
            </div>

            {donateError && (
              <p className="text-xs font-medium text-orange-red">{donateError}</p>
            )}

            {!confirmingDonation ? (
              <button
                type="button"
                disabled={points < donationAmount}
                onClick={() => setConfirmingDonation(true)}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-[6px] bg-primary hover:bg-primary-dark disabled:opacity-40 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('rewards_donate_cta', { amount: donationAmount })}
              </button>
            ) : (
              <div className="p-3.5 rounded-[6px] border border-border bg-sunken space-y-3">
                <p className="text-xs font-bold text-black">{t('rewards_donate_confirm_title')}</p>
                <p className="text-xs text-muted">
                  {t('rewards_donate_confirm_text', {
                    amount: donationAmount,
                    cause: selectedCause ? t(selectedCause.titleKey) : '',
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmDonate}
                    className="flex-1 min-h-[40px] py-2 px-3 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark cursor-pointer"
                  >
                    {t('rewards_donate_confirm_btn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDonation(false)}
                    className="min-h-[40px] py-2 px-3 rounded-[6px] border border-border bg-white text-xs font-semibold text-muted hover:text-black cursor-pointer"
                  >
                    {t('profile_cancel')}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 6. Redemption: Coming Soon card only (no cash, no payment) */}
          <section className="border border-border rounded-[8px] bg-sunken p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-black inline-flex items-center gap-2">
                <GiftIcon className="w-4 h-4 text-primary" />
                <span>{t('rewards_redemption_title')}</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-border text-[11px] font-semibold text-muted">
                {t('rewards_redemption_coming_soon')}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {t('rewards_redemption_desc')}
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN: Ranks (Top 10) + Points History */}
        <div className="md:col-span-7 space-y-6">
          {/* 4. Ranks: tabs "My area" and "By plastic type", top 10 list (first name + initial only) */}
          <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-black">{t('rewards_ranks_title')}</h2>
              <div className="inline-flex p-1 rounded-[6px] bg-sunken border border-border" role="tablist">
                {[
                  { id: 'area', label: t('rewards_ranks_tab_area') },
                  { id: 'plastic', label: t('rewards_ranks_tab_plastic') },
                ].map(tab => {
                  const active = rankTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setRankTab(tab.id)}
                      className={`min-h-[34px] px-3 py-1 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer ${
                        active ? 'bg-primary text-white' : 'text-muted hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divide-y divide-border">
              {activeRanks.map(row => (
                <div
                  key={row.rank}
                  className={`py-2.5 px-2.5 -mx-2.5 rounded-[6px] flex items-center justify-between gap-3 ${
                    row.isCurrentUser ? 'bg-primary-lighter border border-primary/25' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold tabular flex items-center justify-center shrink-0 ${
                        row.rank <= 3
                          ? 'bg-yellow-light text-yellow-dark border border-yellow/40'
                          : 'bg-sunken text-muted'
                      }`}
                    >
                      {row.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-black truncate">
                        {row.name}{' '}
                        {row.isCurrentUser && (
                          <span className="ml-1 px-1.5 py-0.5 rounded-[4px] bg-primary text-white text-[10px] font-semibold">
                            {t('rewards_ranks_you')}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {row.locality || row.detail}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-black tabular shrink-0">
                    {row.value.toLocaleString('en-IN')} {row.unit}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Points History: earned, pending ("Awaiting weigh-in"), and donated */}
          <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
            <h2 className="text-sm font-bold text-black">{t('rewards_history_title')}</h2>

            <div className="flex items-center gap-6 border-b border-border overflow-x-auto">
              {[
                { id: 'all', label: t('rewards_filter_all') },
                { id: 'earned', label: t('rewards_filter_earned') },
                { id: 'pending', label: t('rewards_filter_pending') },
                { id: 'donated', label: t('rewards_filter_donated') },
              ].map(tab => {
                const active = historyFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setHistoryFilter(tab.id)}
                    className={`pb-2.5 text-xs whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
                      active
                        ? 'border-primary text-black font-bold'
                        : 'border-transparent text-muted hover:text-black font-medium'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {filteredHistory.length === 0 ? (
              <EmptyState
                title={t('ui_empty_default_title')}
                description={t('ui_empty_default_description')}
              />
            ) : (
              <div className="divide-y divide-border">
                {filteredHistory.map(entry => (
                  <div
                    key={entry.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold text-black truncate">{entry.title}</p>
                      <p className="text-xs text-muted">
                        {entry.subtitle} · {formatShortDate(entry.date)}
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-0.5">
                      {entry.kind === 'earned' && (
                        <>
                          <p className="text-sm font-bold text-primary tabular">
                            +{entry.points} pts
                          </p>
                          <p className="text-[11px] text-muted">{t('rewards_filter_earned')}</p>
                        </>
                      )}
                      {entry.kind === 'pending' && (
                        <>
                          <p className="text-xs font-semibold text-yellow-dark">
                            {t('rewards_awaiting_weigh')}
                          </p>
                          <p className="text-[11px] text-muted">{t('rewards_filter_pending')}</p>
                        </>
                      )}
                      {entry.kind === 'donated' && (
                        <>
                          <p className="text-sm font-bold text-black tabular">
                            −{entry.points} pts
                          </p>
                          <p className="text-[11px] text-primary font-semibold">
                            {t('rewards_donated_label')}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <BottomMist />
    </div>
  );
}
