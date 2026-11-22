import { useState, useCallback, useEffect } from 'react';
import { getBadgeForPoints, QUANTITY_TIERS } from '../data/mockPickups';
import { pickupApi } from '../services/pickupApi';
import { rewardsApi } from '../services/rewardsApi';
import { storageAdapter } from '../services/storageAdapter';
import { getTodayIst } from '../utils/homeUtils';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing home pickup requests, cancellation, rescheduling, and points.
 * Wraps user-scoped mock services; designed for easy backend swap.
 */
export function usePickups() {
  const { user } = useAuth();
  const userKey = user?.provider === 'google' ? 'google:mock' : (user?.phone || '');
  const [pickups, setPickups] = useState([]);
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const [loadedPickups, loadedProfile, balance] = await Promise.all([
        pickupApi.getPickups(),
        pickupApi.getProfile(),
        rewardsApi.getBalance(),
      ]);
      setPickups(loadedPickups);
      setProfile(loadedProfile);
      setPoints(balance.points);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const [loadedPickups, loadedProfile, balance] = await Promise.all([
        pickupApi.getPickups(),
        pickupApi.getProfile(),
        rewardsApi.getBalance(),
      ]);
      if (mounted) {
        setPickups(loadedPickups);
        setProfile(loadedProfile);
        setPoints(balance.points);
        setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [userKey]);

  useEffect(() => {
    const unsubscribe = storageAdapter.subscribeChanges(() => {
      loadData({ silent: true });
    });
    return unsubscribe;
  }, [loadData]);

  // Request a new pickup
  const requestPickup = useCallback(async ({ quantity, locality, timeWindow }) => {
    const tier = QUANTITY_TIERS.find((t) => t.id === quantity);
    const newPickup = {
      id: `PU-${String(Date.now()).slice(-6)}`,
      date: getTodayIst(),
      quantity: tier?.label || quantity,
      status: 'Requested',
      weightKg: null,
      pointsEarned: null,
      locality,
      timeWindow,
    };
    const next = [newPickup, ...pickups];
    setPickups(next);
    await pickupApi.savePickups(next);
    return newPickup;
  }, [pickups]);

  const cancelPickup = useCallback(async (pickupId) => {
    const updated = await pickupApi.cancelPickup(pickupId);
    setPickups(updated);
    return updated;
  }, []);

  const reschedulePickup = useCallback(async (pickupId, updates) => {
    const updated = await pickupApi.reschedulePickup(pickupId, updates);
    setPickups(updated);
    return updated;
  }, []);

  const badge = getBadgeForPoints(points);
  const totalKgDiverted = profile?.totalKgDiverted || 0;

  const completedPickups = pickups.filter((p) => p.status === 'Completed');
  const pendingPickups = pickups.filter((p) => p.status === 'Requested' || p.status === 'Scheduled');

  return {
    pickups,
    profile,
    loading,
    points,
    badge,
    totalKgDiverted,
    completedPickups,
    pendingPickups,
    requestPickup,
    cancelPickup,
    reschedulePickup,
  };
}
