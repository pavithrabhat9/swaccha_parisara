import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { usePickups } from './usePickups';
import { rewardsApi } from '../services/rewardsApi';
import { storageAdapter } from '../services/storageAdapter';
import { formatDisplayName, getTierProgress } from '../utils/rewardsUtils';

/**
 * Hook for Rewards screen:
 * Uses `rewardsApi` as the single source of truth for points balance (matching Home screen).
 */
export function useRewards() {
  const { user } = useAuth();
  const userKey = user?.provider === 'google' ? 'google:mock' : (user?.phone || '');
  const { pickups, loading: pickupsLoading } = usePickups();

  const [rewardsData, setRewardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRewards = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const data = await rewardsApi.getRewardsData();
      setRewardsData(data);
    } catch (err) {
      if (!silent) {
        setError(err?.message || 'Failed to load rewards');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const data = await rewardsApi.getRewardsData();
        if (mounted) {
          setRewardsData(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load rewards');
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [userKey]);

  useEffect(() => {
    const unsubscribe = storageAdapter.subscribeChanges(() => {
      loadRewards({ silent: true });
    });
    return unsubscribe;
  }, [loadRewards]);

  const points = rewardsData?.points ?? 0;
  const tierProgress = useMemo(() => getTierProgress(points), [points]);
  const userLocality = user?.locality || 'Kadri';
  const userName = user?.name || 'Priya Shetty';
  const donationsList = rewardsData?.donations;
  const rawAreaRanks = rewardsData?.areaRanks;
  const rawPlasticRanks = rewardsData?.plasticTypeRanks;

  // Unified points history: earned, pending ("Awaiting weigh-in"), and donated
  const historyEntries = useMemo(() => {
    const fromPickups = (pickups || [])
      .filter((p) => p.status !== 'Cancelled')
      .map((p) => ({
        id: `hist-${p.id}`,
        date: p.date,
        title: `Home Pickup · ${p.quantity}`,
        subtitle: p.locality || userLocality,
        kind: p.status === 'Completed' && p.pointsEarned ? 'earned' : 'pending',
        points: p.status === 'Completed' ? p.pointsEarned || null : null,
      }));

    const fromDonations = (donationsList || []).map((d) => ({
      id: d.id,
      date: d.date,
      title: d.causeTitle,
      subtitle: 'Donated to NGO cause',
      kind: 'donated',
      points: d.points,
    }));

    return [...fromDonations, ...fromPickups].sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );
  }, [pickups, donationsList, userLocality]);

  const userDisplayName = formatDisplayName(userName);

  const areaRanks = useMemo(() => {
    return (rawAreaRanks || []).map((row) =>
      row.isCurrentUser
        ? { ...row, name: userDisplayName, locality: userLocality, value: points }
        : row
    );
  }, [rawAreaRanks, userDisplayName, userLocality, points]);

  const plasticTypeRanks = useMemo(() => {
    return (rawPlasticRanks || []).map((row) =>
      row.isCurrentUser ? { ...row, name: userDisplayName } : row
    );
  }, [rawPlasticRanks, userDisplayName]);

  const donatePoints = useCallback(async ({ causeId, causeTitle, amount }) => {
    if (!amount || amount <= 0 || amount > points) {
      return { success: false, error: 'Insufficient points balance' };
    }
    const entry = {
      id: `DON-${Date.now()}`,
      causeId,
      causeTitle,
      points: amount,
      date: new Date().toISOString().split('T')[0],
    };
    await rewardsApi.saveDonation(entry);
    const updatedData = await rewardsApi.getRewardsData();
    setRewardsData(updatedData);
    return { success: true, entry };
  }, [points]);

  return {
    loading: loading || pickupsLoading,
    error,
    reloadRewards: () => loadRewards({ silent: false }),
    points,
    tierProgress,
    historyEntries,
    badges: rewardsData?.badges || [],
    causes: rewardsData?.causes || [],
    areaRanks,
    plasticTypeRanks,
    donatePoints,
  };
}
