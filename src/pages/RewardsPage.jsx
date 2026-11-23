import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRewards } from '../hooks/useRewards';
import { useToast } from '../components/ui/Toast';
import PageTopBar from '../components/layout/PageTopBar';
import PointsSummaryCard from '../components/rewards/PointsSummaryCard';
import { BADGE_CATEGORIES, DONATION_AMOUNTS } from '../data/mockRewards';
import { formatShortDate } from '../utils/dateUtils';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard, SkeletonHero } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';
import {
  BadgeMedal,
  CheckCircleIcon,
  LockIcon,
  HeartIcon,
  GiftIcon,
} from '../components/ui/Icons';

/**
 * RewardsPage — Minimal, calm recycling rewards hub aligned with Swachha Parisara's coastal emerald tokens.
 */
export default function RewardsPage() {
  const { t, i18n } = useTranslation();
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

  const [historyFilter, setHistoryFilter] = useState('all');
  const [badgeCategory, setBadgeCategory] = useState('Pickup');
  const [rankTab, setRankTab] = useState('area');
  const [selectedCauseId, setSelectedCauseId] = useState('cause-beach-cleanup');
  const [donationAmount, setDonationAmount] = useState(DONATION_AMOUNTS[0]);
  const [confirmingDonation, setConfirmingDonation] = useState(false);
  const [donateError, setDonateError] = useState('');

  if (loading) {
    return (
      <div>
        <PageTopBar title={t('rewards')} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6" aria-busy="true">
          <SkeletonHero />
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-5">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="md:col-span-5 space-y-5">
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageTopBar title={t('rewards')} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <ErrorState
            title={t('ui_error_default_title')}
            description={error}
            retryLabel={t('ui_error_try_again')}
            onRetry={reloadRewards}
          />
        </div>
      </div>
    );
  }

  const filteredHistory = historyEntries.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.kind === historyFilter;
  });

  const filteredBadges = badges.filter((b) => b.category === badgeCategory);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const activeRanks = rankTab === 'area' ? areaRanks : plasticTypeRanks;
  const selectedCause = causes.find((c) => c.id === selectedCauseId) || causes[0];

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
    <div>
      <PageTopBar title={t('rewards')} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* PRIMARY COLUMN: Balance Hero + Points History + Community Ranks */}
          <div className="lg:col-span-7 space-y-6">
            <PointsSummaryCard points={points} tierProgress={tierProgress} />

            {/* Points History */}
            <section
              aria-labelledby="rewards-history-heading"
              className="rounded-2xl bg-white border border-border overflow-hidden"
            >
              <div className="px-5 pt-5 border-b border-border-light">
                <h2
                  id="rewards-history-heading"
                  className="font-[family-name:var(--font-brand)] text-base font-bold text-ink text-balance mb-3"
                >
                  {t('rewards_history_title')}
                </h2>

                <div
                  className="flex items-center gap-6 overflow-x-auto hide-scrollbar"
                  role="tablist"
                  aria-label={t('rewards_history_title')}
                >
                  {[
                    { id: 'all', label: t('rewards_filter_all') },
                    { id: 'earned', label: t('rewards_filter_earned') },
                    { id: 'pending', label: t('rewards_filter_pending') },
                    { id: 'donated', label: t('rewards_filter_donated') },
                  ].map((tab) => {
                    const active = historyFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setHistoryFilter(tab.id)}
                        className={cn(
                          'min-h-11 pb-2.5 text-xs whitespace-nowrap transition-colors duration-150 cursor-pointer border-b-2 -mb-px',
                          active
                            ? 'border-primary text-ink font-bold'
                            : 'border-transparent text-muted hover:text-ink font-medium'
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title={t('ui_empty_default_title')}
                    description={t('ui_empty_default_description')}
                  />
                </div>
              ) : (
                <div className="divide-y divide-border-light">
                  {filteredHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="px-5 py-3.5 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-semibold text-ink truncate">{entry.title}</p>
                        <p className="text-xs text-muted tabular">
                          {entry.subtitle} — {formatShortDate(entry.date, i18n.language)}
                        </p>
                      </div>

                      <div className="text-right shrink-0 space-y-0.5">
                        {entry.kind === 'earned' && (
                          <>
                            <p className="tabular text-sm font-bold text-primary">
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
                            <p className="tabular text-sm font-bold text-ink">
                              −{entry.points} pts
                            </p>
                            <p className="text-[11px] font-semibold text-primary">
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

          {/* SECONDARY COLUMN: Donate Points + Badges + Community Ranks (last but one) + Redemption */}
          <div className="lg:col-span-5 space-y-6">
            {/* Donate Points to NGO Causes */}
            <section
              aria-labelledby="rewards-donate-heading"
              className="rounded-2xl bg-white border border-border p-5 space-y-4"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="size-10 rounded-xl bg-primary-lighter text-primary flex items-center justify-center shrink-0"
                >
                  <HeartIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2
                    id="rewards-donate-heading"
                    className="font-[family-name:var(--font-brand)] text-base font-bold text-ink text-balance"
                  >
                    {t('rewards_donate_title')}
                  </h2>
                  <p className="text-xs text-muted text-pretty mt-0.5 leading-relaxed">
                    {t('rewards_donate_subtitle')}
                  </p>
                </div>
              </div>

              <div className="space-y-2" role="radiogroup" aria-label={t('rewards_donate_title')}>
                {causes.map((cause) => {
                  const selected = selectedCause?.id === cause.id;
                  return (
                    <button
                      key={cause.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedCauseId(cause.id)}
                      className={cn(
                        'w-full p-3.5 rounded-xl text-left border transition-colors duration-150 cursor-pointer',
                        selected
                          ? 'bg-primary-lighter/70 border-primary'
                          : 'bg-white border-border hover:bg-sunken/50'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <p className="text-xs font-bold text-ink leading-snug">
                          {t(cause.titleKey)}
                        </p>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'size-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                            selected ? 'border-primary' : 'border-border'
                          )}
                        >
                          {selected && <span className="size-2 rounded-full bg-primary" />}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted text-pretty mt-1 leading-relaxed">
                        {t(cause.descKey)}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-ink">{t('rewards_select_amount')}</p>
                <div
                  className="grid grid-cols-3 gap-2"
                  role="radiogroup"
                  aria-label={t('rewards_select_amount')}
                >
                  {DONATION_AMOUNTS.map((amt) => {
                    const selected = donationAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDonationAmount(amt)}
                        className={cn(
                          'min-h-11 py-2 rounded-xl tabular text-xs font-bold border transition-colors duration-150 cursor-pointer',
                          selected
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-ink border-border hover:bg-sunken/60'
                        )}
                      >
                        {amt} pts
                      </button>
                    );
                  })}
                </div>
              </div>

              {donateError && (
                <p role="alert" className="text-xs font-semibold text-orange-red-dark">
                  {donateError}
                </p>
              )}

              {!confirmingDonation ? (
                <button
                  type="button"
                  disabled={points < donationAmount}
                  onClick={() => setConfirmingDonation(true)}
                  className="w-full min-h-11 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors duration-150 cursor-pointer press-scale"
                >
                  {t('rewards_donate_cta', { amount: donationAmount })}
                </button>
              ) : (
                <div
                  role="alertdialog"
                  aria-labelledby="donate-confirm-title"
                  aria-describedby="donate-confirm-desc"
                  className="p-4 rounded-xl bg-sunken border border-border space-y-3"
                >
                  <p id="donate-confirm-title" className="text-xs font-bold text-ink">
                    {t('rewards_donate_confirm_title')}
                  </p>
                  <p id="donate-confirm-desc" className="text-xs text-muted text-pretty leading-relaxed">
                    {t('rewards_donate_confirm_text', {
                      amount: donationAmount,
                      cause: selectedCause ? t(selectedCause.titleKey) : '',
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDonate}
                      className="flex-1 min-h-11 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark cursor-pointer"
                    >
                      {t('rewards_donate_confirm_btn')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDonation(false)}
                      className="min-h-11 py-2 px-3.5 rounded-xl bg-white border border-border text-xs font-semibold text-muted hover:text-ink cursor-pointer"
                    >
                      {t('profile_cancel')}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Badges */}
            <section
              aria-labelledby="rewards-badges-heading"
              className="rounded-2xl bg-white border border-border p-5 space-y-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2
                  id="rewards-badges-heading"
                  className="font-[family-name:var(--font-brand)] text-base font-bold text-ink text-balance"
                >
                  {t('rewards_badges_title')}
                </h2>
                <span className="tabular text-xs font-semibold text-muted">
                  {unlockedCount}/{badges.length}
                </span>
              </div>

              <div
                className="flex flex-wrap gap-1.5"
                role="tablist"
                aria-label={t('rewards_badges_title')}
              >
                {BADGE_CATEGORIES.map((cat) => {
                  const active = badgeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setBadgeCategory(cat.id)}
                      className={cn(
                        'min-h-10 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors duration-150 cursor-pointer',
                        active
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-muted border-border hover:text-ink'
                      )}
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
                    className={cn(
                      'py-3 first:pt-1 last:pb-0 flex items-center gap-3',
                      !item.unlocked && 'opacity-55'
                    )}
                  >
                    <BadgeMedal id={item.id} locked={!item.unlocked} className="size-8 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-ink truncate">{t(item.titleKey)}</p>
                      <p className="text-[11px] text-muted text-pretty leading-snug mt-0.5">
                        {t(item.descKey)}
                      </p>
                    </div>
                    {item.unlocked ? (
                      <CheckCircleIcon className="size-4 text-primary shrink-0" />
                    ) : (
                      <LockIcon className="size-3.5 text-muted shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Community Ranks (last but one) */}
            <section
              aria-labelledby="rewards-ranks-heading"
              className="rounded-2xl bg-white border border-border overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2
                  id="rewards-ranks-heading"
                  className="font-[family-name:var(--font-brand)] text-base font-bold text-ink text-balance"
                >
                  {t('rewards_ranks_title')}
                </h2>

                <div
                  className="inline-flex p-1 rounded-xl bg-sunken self-start sm:self-auto"
                  role="tablist"
                  aria-label={t('rewards_ranks_title')}
                >
                  {[
                    { id: 'area', label: t('rewards_ranks_tab_area') },
                    { id: 'plastic', label: t('rewards_ranks_tab_plastic') },
                  ].map((tab) => {
                    const active = rankTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRankTab(tab.id)}
                        className={cn(
                          'min-h-9 px-3.5 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer',
                          active ? 'bg-white text-ink shadow-xs' : 'text-muted hover:text-ink'
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="divide-y divide-border-light">
                {activeRanks.map((row) => (
                  <div
                    key={row.rank}
                    className={cn(
                      'px-5 py-3 flex items-center justify-between gap-3',
                      row.isCurrentUser && 'bg-primary-lighter/80'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={cn(
                          'size-7 rounded-full tabular text-xs font-bold flex items-center justify-center shrink-0',
                          row.rank === 1
                            ? 'bg-yellow-light text-yellow-dark'
                            : row.rank <= 3
                              ? 'bg-primary-light text-primary-dark'
                              : 'bg-sunken text-muted'
                        )}
                      >
                        {row.rank}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {row.name}
                          {row.isCurrentUser && (
                            <span className="ml-2 px-2 py-0.5 rounded-md bg-primary-light text-primary-dark text-[11px] font-bold">
                              {t('rewards_ranks_you')}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {row.locality || row.detail}
                        </p>
                      </div>
                    </div>

                    <span className="tabular text-sm font-bold text-ink shrink-0">
                      {row.value.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-medium text-muted">{row.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Redemption Coming Soon */}
            <section
              aria-labelledby="rewards-redemption-heading"
              className="rounded-2xl bg-white border border-border p-4 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="rewards-redemption-heading"
                  className="text-xs font-bold text-ink inline-flex items-center gap-2"
                >
                  <GiftIcon className="size-4 text-primary shrink-0" />
                  <span>{t('rewards_redemption_title')}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-sunken text-muted text-[11px] font-semibold">
                  {t('rewards_redemption_coming_soon')}
                </span>
              </div>
              <p className="text-xs text-muted text-pretty leading-relaxed">
                {t('rewards_redemption_desc')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
