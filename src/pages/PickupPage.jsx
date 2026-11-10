import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { usePickups } from '../hooks/usePickups';
import { useToast } from '../components/ui/Toast';
import LoginFlow from '../components/auth/LoginFlow';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SuccessState from '../components/ui/SuccessState';
import SlowNetworkAlert from '../components/ui/SlowNetworkAlert';
import ErrorState from '../components/ui/ErrorState';
import { QUANTITY_TIERS, TIME_WINDOWS, DK_LOCALITIES, BADGES } from '../data/mockPickups';

import {
  MapPinIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  LockIcon,
  XIcon,
  BadgeMedal,
} from '../components/ui/Icons';
import { getBagDetails } from '../utils/pickupUtils';

/**
 * PickupPage — Home plastic pickup request + rewards & collection dashboard.
 */
export default function PickupPage() {
  const { t } = useTranslation();
  const authHook = useAuth();
  const { isLoggedIn, user } = authHook;
  const { pickups, loading, points, badge, totalKgDiverted, requestPickup } = usePickups();
  const { showToast } = useToast();

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [quantity, setQuantity] = useState('');
  const [locality, setLocality] = useState(() => user?.locality || '');
  const [timeWindow, setTimeWindow] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSlowNetwork, setShowSlowNetwork] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize locality from user profile
  React.useEffect(() => {
    if (user?.locality) {
      const timer = setTimeout(() => setLocality(user.locality), 0);
      return () => clearTimeout(timer);
    }
  }, [user?.locality]);

  // Logged-out state: "Log in to earn points" screen listing 3 benefits + existing phone login flow
  if (!isLoggedIn) {
    const benefits = [
      t('pickup_benefit_1'),
      t('pickup_benefit_2'),
      t('pickup_benefit_3'),
    ];

    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-black tracking-tight">
              {t('pickup_login_title')}
            </h2>
            <p className="text-xs text-muted mt-1">
              {t('pickup_login_subtitle')}
            </p>
          </div>

          <ul className="space-y-2.5 pt-1">
            {benefits.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-black">
                <CheckCircleIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-border rounded-[8px] bg-white">
          <LoginFlow authHook={authHook} />
        </section>
      </div>
    );
  }

  // Loading state (initial load only)
  if (loading && pickups.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <Skeleton width="200px" height="24px" rounded="sm" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const handleRequestPickup = () => {
    const newErrors = {};
    if (!quantity) newErrors.quantity = 'Please select a bag size';
    if (!timeWindow) newErrors.timeWindow = 'Please select a preferred time';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);
    setShowSlowNetwork(false);

    const slowTimer = setTimeout(() => {
      setShowSlowNetwork(true);
    }, 5000);

    setTimeout(() => {
      clearTimeout(slowTimer);
      setShowSlowNetwork(false);
      requestPickup({ quantity, locality: locality || user?.locality || 'Kadri', timeWindow });
      setSubmitting(false);
      setShowRequestForm(false);
      setShowSuccessModal(true);
      setQuantity('');
      setTimeWindow('');
      setErrors({});
      showToast('Pickup requested successfully!', 'success', 3000);
    }, 700);
  };

  // Compute next badge tier progress
  const currentBadgeIndex = BADGES.findIndex(b => b.label === badge?.label);
  const nextBadge = currentBadgeIndex !== -1 && currentBadgeIndex < BADGES.length - 1
    ? BADGES[currentBadgeIndex + 1]
    : null;
  const currentMin = badge?.minPoints || 0;
  const targetPoints = nextBadge ? nextBadge.minPoints : (badge?.maxPoints || 5000);
  const progressPercent = nextBadge
    ? Math.min(100, Math.max(0, Math.round(((points - currentMin) / (targetPoints - currentMin)) * 100)))
    : 100;

  // Compute summary stats and filtered list for history section
  const completedCount = pickups.filter(p => p.status === 'Completed').length;
  const pendingCount = pickups.filter(p => p.status === 'Scheduled' || p.status === 'Requested').length;

  // Active requests (Scheduled or Requested) shown above history
  const activeRequest = pickups.find(p => p.status === 'Scheduled' || p.status === 'Requested');

  const filteredPickups = pickups.filter(p => {
    if (historyFilter === 'completed') return p.status === 'Completed';
    if (historyFilter === 'pending') return p.status === 'Scheduled' || p.status === 'Requested';
    return true;
  });

  // Mock milestone badges (unlocked vs locked with unlock condition)
  const milestoneBadges = [
    {
      id: 'starter',
      title: t('pickup_badge_first_pickup'),
      description: t('pickup_badge_first_pickup_desc'),
      unlocked: completedCount >= 1,
    },
    {
      id: 'bronze',
      title: t('pickup_badge_50kg'),
      description: t('pickup_badge_50kg_desc'),
      unlocked: totalKgDiverted >= 50,
    },
    {
      id: 'silver',
      title: t('pickup_badge_silver'),
      description: t('pickup_badge_silver_desc'),
      unlocked: points >= 1000,
    },
    {
      id: 'gold',
      title: t('pickup_badge_gold'),
      description: t('pickup_badge_gold_desc'),
      unlocked: points >= 2500,
    },
    {
      id: 'champion',
      title: t('pickup_badge_champion'),
      description: t('pickup_badge_champion_desc'),
      unlocked: points >= 5000,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* ====================================================
            LEFT COLUMN: Points Overview, Request Form & Badges
            ==================================================== */}
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-24 space-y-6">
          {/* === POINTS & PROGRESS SECTION === */}
          <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  {t('yourPoints')}
                </p>
                <p className="text-3xl font-bold text-black tracking-tight tabular mt-1">
                  {points.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-black">
                  <span>{badge?.icon}</span> {badge?.label}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {totalKgDiverted}{t('kgDiverted')}
                </p>
              </div>
            </div>

            {/* Next-tier linear progress */}
            <div className="pt-4 border-t border-border-light space-y-2">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-medium text-black">
                  {nextBadge
                    ? t('pickup_points_to_next_tier', {
                        current: points.toLocaleString(),
                        target: targetPoints.toLocaleString(),
                        tier: nextBadge.label,
                      })
                    : t('pickup_top_tier_reached', { current: points.toLocaleString() })}
                </span>
                <span className="text-muted tabular shrink-0">
                  {nextBadge ? `${progressPercent}%` : '100%'}
                </span>
              </div>

              <div className="w-full h-1.5 bg-sunken rounded-[4px] overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* === REQUEST PICKUP ACTION / FORM === */}
          {!showRequestForm ? (
            <button
              type="button"
              onClick={() => setShowRequestForm(true)}
              className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-[6px] text-sm
                hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('requestHomePickup')}</span>
            </button>
          ) : (
            <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-light">
                <h3 className="text-sm font-bold text-black">{t('requestPickup')}</h3>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="text-muted hover:text-black cursor-pointer p-1 rounded-[4px]"
                  title="Close"
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Quantity tier */}
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-2 uppercase tracking-wider">
                  {t('quantity')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {QUANTITY_TIERS.map(tier => {
                    const selected = quantity === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => { setQuantity(tier.id); setErrors(prev => ({ ...prev, quantity: null })); }}
                        className={`py-2.5 px-2 rounded-[6px] border text-center transition-colors cursor-pointer
                          ${selected
                            ? 'border-primary text-primary bg-white ring-1 ring-primary'
                            : 'border-border bg-white text-black hover:border-black/30'
                          }`}
                      >
                        <p className={`text-xs font-semibold ${selected ? 'text-primary' : 'text-black'}`}>
                          {tier.label}
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">{tier.description}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.quantity && <p className="text-xs text-orange-red mt-1.5 font-medium">{errors.quantity}</p>}
              </div>

              {/* Locality */}
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-2 uppercase tracking-wider">
                  {t('pickupAddress')}
                </label>
                <select
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-[6px] text-sm bg-white text-black
                    focus:outline-none focus:border-primary cursor-pointer"
                >
                  {DK_LOCALITIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Time window */}
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-2 uppercase tracking-wider">
                  {t('preferredTime')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_WINDOWS.map(tw => {
                    const selected = timeWindow === tw.id;
                    return (
                      <button
                        key={tw.id}
                        type="button"
                        onClick={() => { setTimeWindow(tw.id); setErrors(prev => ({ ...prev, timeWindow: null })); }}
                        className={`py-2.5 px-3 rounded-[6px] border text-xs font-semibold transition-colors cursor-pointer
                          ${selected
                            ? 'border-primary text-primary bg-white ring-1 ring-primary'
                            : 'border-border bg-white text-black hover:border-black/30'
                          }`}
                      >
                        {tw.label}
                      </button>
                    );
                  })}
                </div>
                {errors.timeWindow && <p className="text-xs text-orange-red mt-1.5 font-medium">{errors.timeWindow}</p>}
              </div>

              {/* Slow Network Alert */}
              {showSlowNetwork && (
                <SlowNetworkAlert
                  onRetry={handleRequestPickup}
                  onCancel={() => { setShowSlowNetwork(false); setSubmitting(false); }}
                />
              )}

              {/* Recoverable Error State */}
              {submissionError && (
                <ErrorState
                  title="Request Failed"
                  description={submissionError}
                  onRetry={handleRequestPickup}
                />
              )}

              <button
                type="button"
                onClick={handleRequestPickup}
                disabled={submitting}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-[6px] text-sm
                  hover:bg-primary-dark transition-colors cursor-pointer
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scheduling…
                  </>
                ) : (
                  t('confirmPickup')
                )}
              </button>
            </section>
          )}

          {/* === BADGES SECTION === */}
          <section className="border border-border rounded-[8px] bg-white p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-black">{t('pickup_badges_title')}</h3>
            <div className="divide-y divide-border-light">
              {milestoneBadges.map(item => (
                <div
                  key={item.id}
                  className={`py-2.5 first:pt-0 last:pb-0 flex items-center gap-3 ${
                    item.unlocked ? '' : 'opacity-50 grayscale'
                  }`}
                >
                  <BadgeMedal id={item.id} locked={!item.unlocked} className="w-7 h-7 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-black truncate">{item.title}</p>
                    <p className="text-[11px] text-muted truncate">{item.description}</p>
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
        </div>

        {/* ====================================================
            RIGHT COLUMN: Active Request + Pickup History & Status
            ==================================================== */}
        <section className="md:col-span-7 lg:col-span-8 space-y-6">
          {/* === ACTIVE REQUEST STATUS CARD (above history when Requested or Scheduled) === */}
          {activeRequest && (
            <div className="border border-border rounded-[8px] bg-white p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-[6px] border border-border bg-sunken flex items-center justify-center text-primary shrink-0 mt-0.5">
                  {activeRequest.status === 'Scheduled' ? (
                    <CalendarIcon className="w-4 h-4" />
                  ) : (
                    <ClockIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                    {t('pickup_active_request_title')}
                  </p>
                  <p className="text-sm font-bold text-black">
                    {activeRequest.status === 'Scheduled'
                      ? t('pickup_active_scheduled_window')
                      : t('pickup_active_requested_window', {
                          window: activeRequest.timeWindow || 'This Week',
                        })}
                  </p>
                  <p className="text-xs text-muted">
                    {activeRequest.quantity} · {activeRequest.locality || user?.locality || 'Kadri'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary shrink-0">
                {activeRequest.status}
              </span>
            </div>
          )}

          <div>
            {/* Section Title */}
            <h3 className="text-base font-bold text-black mb-4">Pickup History & Status</h3>

            {/* Centered Filter Tabs (Total / Completed / Pending) */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 border-b border-border">
              {[
                { id: 'all', label: 'Total', count: pickups.length },
                { id: 'completed', label: 'Completed', count: completedCount },
                { id: 'pending', label: 'Pending', count: pendingCount },
              ].map(tab => {
                const active = historyFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setHistoryFilter(tab.id)}
                    className={`pb-3 text-sm transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5
                      ${active
                        ? 'border-primary text-black font-bold'
                        : 'border-transparent text-muted hover:text-black font-medium'
                      }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`tabular ${active ? 'text-primary font-bold' : 'text-muted'}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Flat, Divided Activity List */}
            <div>
              {loading ? (
                <div className="space-y-3 pt-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : filteredPickups.length === 0 ? (
                <div className="pt-6">
                  <EmptyState
                    title="No pickups yet"
                    description="Request a doorstep pickup for your dry recyclable plastic waste."
                    actionLabel="Request Home Pickup"
                    onAction={() => setShowRequestForm(true)}
                  />
                </div>
              ) : (
                <div className="divide-y divide-border border-b border-border">
                  {filteredPickups.map(pickup => {
                    const bag = getBagDetails(pickup.quantity);
                    const formattedDate = new Date(pickup.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={pickup.id}
                        className="py-4 flex items-start justify-between gap-4"
                      >
                        {/* Left: Icon + Bag Info + Metadata */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div
                            className="w-9 h-9 rounded-[6px] border border-border bg-sunken flex items-center justify-center text-muted shrink-0 mt-0.5"
                            title={bag.label}
                          >
                            {bag.icon}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-black leading-snug">
                                {pickup.quantity}
                              </p>
                              <span className="text-xs text-muted">{bag.weight}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
                              <span className="inline-flex items-center gap-1 text-black/80">
                                <MapPinIcon className="w-3.5 h-3.5 text-muted shrink-0" />
                                <span>{pickup.locality || user?.locality || 'Dakshina Kannada'}</span>
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{formattedDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Points + Plain Status */}
                        <div className="text-right shrink-0 space-y-1">
                          {pickup.pointsEarned ? (
                            <p className="text-sm font-bold text-primary tabular">
                              +{pickup.pointsEarned} pts
                            </p>
                          ) : (
                            <p className="text-xs font-medium text-muted">
                              Pending pts
                            </p>
                          )}
                          <p className="text-[11px] font-medium text-muted">
                            {pickup.status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[8px] max-w-sm w-full p-6 border border-border">
            <SuccessState
              title="Pickup Scheduled!"
              description="Our collection vehicle will visit your locality during the selected window. We'll send an SMS when the driver is nearby."
              actionLabel="Done"
              onAction={() => setShowSuccessModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
