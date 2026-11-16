import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { usePickups } from './usePickups';
import { rewardsApi } from '../services/rewardsApi';
import { pickupApi } from '../services/pickupApi';
import { formatDisplayName, getTierProgress } from '../utils/rewardsUtils';

/**
 * Hook for Stage 5 Rewards screen:
 * - Points balance & tier progress
 * - Combined points history (earned, pending "Awaiting weigh-in", and donated)
 * - Badges grouped by category (Pickup, Report, Streak, Plastic type)
 * - Ranks ("My area" and "By plastic type") with current user's row highlighted
 * - Donate points to sample NGO causes
 */
export function useRewards() {
  const { user } = useAuth();
  const { pickups, profile, loading: pickupsLoading } = usePickups();

  const [rewardsData, setRewardsData] = useState(null);
  const [pointsOverride, setPointsOverride] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rewardsApi.getRewardsData();
      setRewardsData(data);
    } catch (err) {
      setError(err?.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
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
  }, []);

  const points = pointsOverride !== null ? pointsOverride : (profile?.points ?? 1240);
  const tierProgress = useMemo(() => getTierProgress(points), [points]);
  const userLocality = user?.locality || 'Kadri';
  const userName = user?.name || 'Priya Shetty';
  const donationsList = rewardsData?.donations;
  const rawAreaRanks = rewardsData?.areaRanks;
  const rawPlasticRanks = rewardsData?.plasticTypeRanks;

  // Unified points history: earned, pending ("Awaiting weigh-in"), and donated
  const historyEntries = useMemo(() => {
    const fromPickups = (pickups || []).map(p => ({
      id: `hist-${p.id}`,
      date: p.date,
      title: `Home Pickup · ${p.quantity}`,
      subtitle: p.locality || userLocality,
      kind: p.pointsEarned ? 'earned' : 'pending',
      points: p.pointsEarned || null,
    }));

    const fromDonations = (donationsList || []).map(d => ({
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
    return (rawAreaRanks || []).map(row =>
      row.isCurrentUser
        ? { ...row, name: userDisplayName, locality: userLocality, value: points }
        : row
    );
  }, [rawAreaRanks, userDisplayName, userLocality, points]);

  const plasticTypeRanks = useMemo(() => {
    return (rawPlasticRanks || []).map(row =>
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
    const updatedDonations = await rewardsApi.saveDonation(entry);
    const nextPoints = Math.max(0, points - amount);
    setPointsOverride(nextPoints);
    if (profile) {
      await pickupApi.saveProfile({ ...profile, points: nextPoints });
    }
    setRewardsData(prev => (prev ? { ...prev, donations: updatedDonations } : prev));
    return { success: true, entry };
  }, [points, profile]);

  return {
    loading: loading || pickupsLoading,
    error,
    reloadRewards: loadRewards,
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
