import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePickups } from '../hooks/usePickups';
import { useToast } from '../components/ui/Toast';
import LoginFlow from '../components/auth/LoginFlow';
import StatusBadge from '../components/ui/StatusBadge';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SuccessState from '../components/ui/SuccessState';
import SlowNetworkAlert from '../components/ui/SlowNetworkAlert';
import ErrorState from '../components/ui/ErrorState';
import { QUANTITY_TIERS, TIME_WINDOWS, DK_LOCALITIES, BADGES } from '../data/mockPickups';

/* --- Professional SVG Icon Components --- */
const BagSmallIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const BagMediumIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const BagLargeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
    <path d="m7 16.5-4.74-2.85" />
    <path d="m7 16.5 5-3" />
    <path d="M7 16.5v5.17" />
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
    <path d="m17 16.5-5-3" />
    <path d="m17 16.5 4.74-2.85" />
    <path d="M17 16.5v5.17" />
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
    <path d="M12 8 7.26 5.15" />
    <path d="m12 8 4.74-2.85" />
    <path d="M12 13.5V8" />
  </svg>
);

const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function getBagDetails(quantity) {
  const q = quantity?.toLowerCase() || '';
  if (q.includes('small')) return { icon: <BagSmallIcon className="w-5 h-5" />, label: 'Small Bag', weight: '~1–2 kg' };
  if (q.includes('large')) return { icon: <BagLargeIcon className="w-5 h-5" />, label: 'Large Bag', weight: '~6–10 kg' };
  return { icon: <BagMediumIcon className="w-5 h-5" />, label: 'Medium Bag', weight: '~3–5 kg' };
}

/**
 * PickupPage — Home plastic pickup request + points dashboard.
 * Shows login flow if not authenticated, then the pickup dashboard.
 */
export default function PickupPage() {
  const authHook = useAuth();
  const { isLoggedIn, user, logout } = authHook;
  const { pickups, loading, points, badge, totalKgDiverted, requestPickup } = usePickups();
  const { showToast } = useToast();

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  // Not logged in — show auth flow
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoginFlow authHook={authHook} />
      </div>
    );
  }

  // Loading state (initial load only)
  if (loading && pickups.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <Skeleton width="200px" height="28px" rounded="lg" />
        <SkeletonCard />
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

  // Compute next badge tier for desktop visual polish
  const currentBadgeIndex = BADGES.findIndex(b => b.label === badge?.label);
  const nextBadge = currentBadgeIndex !== -1 && currentBadgeIndex < BADGES.length - 1
    ? BADGES[currentBadgeIndex + 1]
    : null;
  const currentMin = badge?.minPoints || 0;
  const targetPoints = nextBadge ? nextBadge.minPoints : (badge?.maxPoints || 1);
  const progressPercent = nextBadge
    ? Math.min(100, Math.max(0, Math.round(((points - currentMin) / (targetPoints - currentMin)) * 100)))
    : 100;

  // Compute summary stats for desktop history header
  const completedCount = pickups.filter(p => p.status === 'Completed').length;
  const pendingCount = pickups.filter(p => p.status === 'Scheduled' || p.status === 'Requested').length;

  return (
    <div className="max-w-lg md:max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-fade-in-up">
      {/* 2-Column Responsive Grid on Wide Screens */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
        {/* ====================================================
            LEFT / SIDEBAR COLUMN (33-35% width on desktop)
            Persistent status panel: Greeting, Points Card, Request Form
            ==================================================== */}
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-24 md:bg-white md:p-6 md:rounded-2xl md:border md:border-border md:shadow-card space-y-5">
          {/* User greeting + logout */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black">
                Hi, {user?.name?.split(' ')[0] || 'there'}
              </h2>
              <p className="text-xs text-muted">{user?.locality || 'Dakshina Kannada'}</p>
            </div>
            <button
              onClick={logout}
              className="text-xs text-muted hover:text-orange-red transition-colors font-medium cursor-pointer"
            >
              Sign out
            </button>
          </div>

          {/* === POINTS CARD === */}
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white shadow-fab relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">Your Points</p>
              <p className="text-4xl font-extrabold tracking-tight mb-3">
                {points.toLocaleString()}
              </p>

              <div className="flex items-center gap-3">
                <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span>{badge?.icon}</span> {badge?.label}
                </span>
                <span className="text-xs text-white/70 font-medium">
                  {totalKgDiverted}kg diverted
                </span>
              </div>

              {/* Supporting visual & next-tier progress */}
              <div className="block mt-4 pt-3.5 border-t border-white/15 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-white/90">
                  <span className="flex items-center gap-1">
                    <span>Next Tier:</span>
                    <span className="font-semibold text-white">
                      {nextBadge ? `${nextBadge.icon} ${nextBadge.label}` : 'Top Tier Reached! 🏆'}
                    </span>
                  </span>
                  <span className="text-white/70">
                    {nextBadge ? `${(nextBadge.minPoints - points).toLocaleString()} pts to go` : 'MAX'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>{badge?.icon} {badge?.label}</span>
                  <span>{nextBadge ? `${progressPercent}%` : '100%'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* === REQUEST PICKUP BUTTON/FORM === */}
          {!showRequestForm ? (
            <button
              onClick={() => setShowRequestForm(true)}
              className="w-full py-3.5 bg-surface border-2 border-primary text-primary font-semibold rounded-xl text-sm
                hover:bg-primary-lighter active:scale-[0.98] transition-all duration-150
                flex items-center justify-center gap-2 shadow-card cursor-pointer"
            >
              <span>Request Home Pickup</span>
            </button>
          ) : (
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-card animate-fade-in-up space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-black">Request Pickup</h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-muted hover:text-black cursor-pointer p-1 rounded-lg hover:bg-border-light"
                  title="Close"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Quantity tier */}
              <div>
                <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">
                  Quantity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {QUANTITY_TIERS.map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => { setQuantity(tier.id); setErrors(prev => ({ ...prev, quantity: null })); }}
                      className={`py-3 rounded-xl border text-center transition-all press-scale cursor-pointer
                        ${quantity === tier.id
                          ? 'border-primary bg-primary-light'
                          : 'border-border bg-surface hover:border-primary/30'
                        }`}
                    >
                      <p className={`text-xs font-semibold ${quantity === tier.id ? 'text-primary' : 'text-black'}`}>
                        {tier.label}
                      </p>
                      <p className="text-[10px] text-muted">{tier.description}</p>
                    </button>
                  ))}
                </div>
                {errors.quantity && <p className="text-xs text-orange-red mt-1 font-medium">{errors.quantity}</p>}
              </div>

              {/* Locality */}
              <div>
                <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">
                  Pickup Address
                </label>
                <select
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-surface text-black
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 appearance-none cursor-pointer"
                >
                  {DK_LOCALITIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Time window */}
              <div>
                <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">
                  Preferred Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_WINDOWS.map(tw => (
                    <button
                      key={tw.id}
                      onClick={() => { setTimeWindow(tw.id); setErrors(prev => ({ ...prev, timeWindow: null })); }}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all press-scale cursor-pointer
                        ${timeWindow === tw.id
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border text-muted hover:border-primary/30'
                        }`}
                    >
                      {tw.label}
                    </button>
                  ))}
                </div>
                {errors.timeWindow && <p className="text-xs text-orange-red mt-1 font-medium">{errors.timeWindow}</p>}
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
                onClick={handleRequestPickup}
                disabled={submitting}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl text-sm
                  hover:bg-primary-dark active:scale-[0.98] transition-all shadow-fab cursor-pointer
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scheduling…
                  </>
                ) : (
                  'Confirm Pickup'
                )}
              </button>
            </div>
          )}
        </div>

        {/* ====================================================
            RIGHT / MAIN COLUMN (65-67% width on desktop)
            Pickup History: 2-column card grid on wide screens
            ==================================================== */}
        <div className="md:col-span-7 lg:col-span-8">
          {/* Responsive Header & Summary Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-black">Pickup History & Status</h3>
              <p className="text-xs text-muted mt-0.5">
                Track your scheduled collections and diverted plastic waste
              </p>
            </div>
            <div className="grid grid-cols-3 sm:flex items-center gap-2">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-border shadow-xs text-center">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Total</p>
                <p className="text-sm font-bold text-black">{pickups.length}</p>
              </div>
              <div className="bg-primary-light px-3 py-1.5 rounded-xl border border-primary/20 shadow-xs text-center">
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Completed</p>
                <p className="text-sm font-bold text-primary">{completedCount}</p>
              </div>
              {pendingCount > 0 && (
                <div className="bg-yellow-light px-3 py-1.5 rounded-xl border border-yellow/30 shadow-xs text-center">
                  <p className="text-[10px] font-semibold text-black uppercase tracking-wider">Pending</p>
                  <p className="text-sm font-bold text-black">{pendingCount}</p>
                </div>
              )}
            </div>
          </div>

          {/* History list container */}
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : pickups.length === 0 ? (
              <div className="md:col-span-full">
                <EmptyState
                  title="No pickups yet"
                  description="Request a doorstep pickup for your dry recyclable plastic waste."
                  actionLabel="Request Home Pickup"
                  onAction={() => setShowRequestForm(true)}
                />
              </div>
            ) : (
              pickups.map(pickup => {
                const bag = getBagDetails(pickup.quantity);
                return (
                  <div
                    key={pickup.id}
                    className="bg-surface rounded-xl md:rounded-2xl border border-border p-3.5 md:p-4 shadow-xs md:shadow-card md:hover:shadow-elevated md:hover:border-primary/30 transition-all press-scale flex flex-col justify-between gap-3 md:gap-3.5"
                  >
                    {/* Top row: Bag size & icon + Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0
                            ${pickup.status === 'Completed' ? 'bg-primary-light text-primary' : 'bg-yellow-light text-black'}`}
                          title={bag.label}
                        >
                          {bag.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-black leading-tight truncate">{pickup.quantity}</p>
                          <p className="text-[11px] text-muted font-medium mt-0.5">{bag.weight}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={pickup.status} />
                      </div>
                    </div>

                    {/* Middle box: Locality & Date surfaced prominently */}
                    <div className="bg-border-light/60 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 text-black font-medium truncate mr-2">
                        <MapPinIcon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="truncate">{pickup.locality || user?.locality || 'Dakshina Kannada'}</span>
                      </div>
                      <div className="text-muted font-medium flex-shrink-0">
                        {new Date(pickup.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Bottom footer: Verification text & prominent points badge */}
                    <div className="flex items-center justify-between pt-1 border-t border-border-light/80">
                      <div className="flex items-center gap-1 text-[11px]">
                        {pickup.status === 'Completed' ? (
                          <span className="text-primary font-semibold flex items-center gap-1.5">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            <span>Verified Collection</span>
                          </span>
                        ) : pickup.status === 'Scheduled' ? (
                          <span className="text-muted font-medium flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>Scheduled Pickup</span>
                          </span>
                        ) : (
                          <span className="text-muted font-medium flex items-center gap-1.5">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Awaiting Schedule</span>
                          </span>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {pickup.pointsEarned ? (
                          <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full border border-primary/20">
                            +{pickup.pointsEarned} pts
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-muted bg-border-light px-2.5 py-1 rounded-full">
                            Pending pts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-elevated border border-border">
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
