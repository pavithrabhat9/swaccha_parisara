import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { usePickups } from './usePickups';
import { impactApi } from '../services/impactApi';
import { dropPointApi } from '../services/dropPointApi';
import { getActivePickup } from '../utils/pickupStatusUtils';
import { getTierProgress } from '../utils/rewardsUtils';
import { getTipOfTheDay } from '../utils/tipUtils';
import { getNearestDropPoint } from '../utils/dropPointUtils';

/**
 * Data for the Home screen: points + tier, next pickup, impact, tip of the day, nearest drop point.
 * Pickups and points come from usePickups; community impact and drop points from mock services.
 */
export function useHome() {
  const { user } = useAuth();
  const { pickups, loading: pickupsLoading, points, totalKgDiverted } = usePickups();

  const [remote, setRemote] = useState({ loading: true, error: false, community: null, dropPoints: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [community, dropPoints] = await Promise.all([
          impactApi.getCommunityImpact(),
          dropPointApi.getDropPoints(),
        ]);
        if (mounted) setRemote({ loading: false, error: false, community, dropPoints });
      } catch {
        if (mounted) setRemote({ loading: false, error: true, community: null, dropPoints: [] });
      }
    };
    load();
    return () => { mounted = false; };
  }, [attempt]);

  const retry = useCallback(() => {
    setRemote(prev => ({ ...prev, loading: true, error: false }));
    setAttempt(prev => prev + 1);
  }, []);

  const tierProgress = useMemo(() => getTierProgress(points), [points]);
  const activePickup = useMemo(() => getActivePickup(pickups), [pickups]);
  const tip = useMemo(() => getTipOfTheDay(), []);
  const nearbyDropPoint = useMemo(() => getNearestDropPoint(remote.dropPoints), [remote.dropPoints]);

  return {
    firstName: user?.name?.split(' ')[0] || '',
    locality: user?.locality || '',
    loading: pickupsLoading || remote.loading,
    error: remote.error,
    retry,
    points,
    tierProgress,
    activePickup,
    totalKgDiverted,
    communityKg: remote.community?.communityKgThisMonth ?? 0,
    tip,
    nearbyDropPoint,
  };
}

