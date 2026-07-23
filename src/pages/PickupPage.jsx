import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePickups } from '../hooks/usePickups';
import { useToast } from '../components/ui/Toast';
import LoginFlow from '../components/auth/LoginFlow';
import StatusBadge from '../components/ui/StatusBadge';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { QUANTITY_TIERS, TIME_WINDOWS, DK_LOCALITIES } from '../data/mockPickups';

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
  const [quantity, setQuantity] = useState('');
  const [locality, setLocality] = useState('');
  const [timeWindow, setTimeWindow] = useState('');

  // Initialize locality from user profile
  React.useEffect(() => {
    if (user?.locality) setLocality(user.locality);
  }, [user?.locality]);

  // Not logged in — show auth flow
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoginFlow authHook={authHook} />
      </div>
    );
  }

  // Loading state
  if (loading) {
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
    if (!quantity) {
      showToast('Please select a bag size', 'error');
      return;
    }
    if (!timeWindow) {
      showToast('Please select a time window', 'error');
      return;
    }

    requestPickup({ quantity, locality: locality || user?.locality || 'Kadri', timeWindow });
    setShowRequestForm(false);
    setQuantity('');
    setTimeWindow('');
    showToast('Pickup requested — we\'ll batch this with nearby requests and notify you of your pickup window.', 'success', 4000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      {/* User greeting + logout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-black">
            Hi, {user?.name?.split(' ')[0] || 'there'} 👋
          </h2>
          <p className="text-xs text-muted">{user?.locality || 'Dakshina Kannada'}</p>
        </div>
        <button
          onClick={logout}
          className="text-xs text-muted hover:text-orange-red transition-colors font-medium"
        >
          Sign out
        </button>
      </div>

      {/* === POINTS CARD === */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white shadow-fab relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">Your Points</p>
          <p className="text-4xl font-extrabold tracking-tight mb-3">
            {points.toLocaleString()}
          </p>

          <div className="flex items-center gap-3">
            <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span>{badge.icon}</span> {badge.label}
            </span>
            <span className="text-xs text-white/70 font-medium">
              {totalKgDiverted}kg diverted
            </span>
          </div>
        </div>
      </div>

      {/* === REQUEST PICKUP BUTTON/FORM === */}
      {!showRequestForm ? (
        <button
          onClick={() => setShowRequestForm(true)}
          className="w-full py-3.5 bg-surface border-2 border-primary text-primary font-semibold rounded-xl text-sm
            hover:bg-primary-lighter active:scale-[0.98] transition-all duration-150
            flex items-center justify-center gap-2 shadow-card"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Request Home Pickup
        </button>
      ) : (
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-card animate-fade-in-up space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">Request Pickup</h3>
            <button onClick={() => setShowRequestForm(false)} className="text-muted hover:text-black text-lg">✕</button>
          </div>

          {/* Quantity tier */}
          <div>
            <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">Quantity</label>
            <div className="grid grid-cols-3 gap-2">
              {QUANTITY_TIERS.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setQuantity(tier.id)}
                  className={`py-3 rounded-xl border text-center transition-all press-scale
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
          </div>

          {/* Locality */}
          <div>
            <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">Pickup Address</label>
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
            <label className="block text-[10px] font-semibold text-muted mb-1.5 uppercase tracking-wide">Preferred Time</label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_WINDOWS.map(tw => (
                <button
                  key={tw.id}
                  onClick={() => setTimeWindow(tw.id)}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition-all press-scale
                    ${timeWindow === tw.id
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border text-muted hover:border-primary/30'
                    }`}
                >
                  {tw.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRequestPickup}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl text-sm
              hover:bg-primary-dark active:scale-[0.98] transition-all shadow-fab"
          >
            Confirm Pickup
          </button>
        </div>
      )}

      {/* === PICKUP HISTORY === */}
      <div>
        <h3 className="text-sm font-bold text-black mb-3">Pickup History</h3>
        <div className="space-y-2">
          {pickups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm font-medium text-muted">No pickups yet</p>
              <p className="text-xs text-muted-light">Request your first pickup above!</p>
            </div>
          ) : (
            pickups.map(pickup => (
              <div key={pickup.id} className="bg-surface rounded-xl border border-border p-3.5 shadow-xs flex items-center gap-3 press-scale transition-all">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${pickup.status === 'Completed' ? 'bg-primary-light' : 'bg-yellow-light'}`}
                >
                  <span className="text-lg">
                    {pickup.status === 'Completed' ? '✓' : pickup.status === 'Scheduled' ? '📅' : '⏳'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-black">{pickup.quantity}</p>
                    <StatusBadge status={pickup.status} />
                  </div>
                  <p className="text-[10px] text-muted">
                    {new Date(pickup.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {pickup.locality && ` · ${pickup.locality}`}
                  </p>
                </div>

                {/* Points */}
                {pickup.pointsEarned && (
                  <span className="text-xs font-bold text-primary bg-primary-light px-2 py-1 rounded-full">
                    +{pickup.pointsEarned}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
