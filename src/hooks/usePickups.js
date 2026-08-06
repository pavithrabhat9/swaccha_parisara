import { useState, useCallback, useEffect } from 'react';
import { getBadgeForPoints, QUANTITY_TIERS } from '../data/mockPickups';
import { pickupApi } from '../services/pickupApi';

/**
 * Custom hook for managing home pickup requests and points.
 * Wraps mock data; designed for easy backend swap.
 */
export function usePickups() {
  const [pickups, setPickups] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial load with simulated delay
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [loadedPickups, loadedProfile] = await Promise.all([
        pickupApi.getPickups(),
        pickupApi.getProfile()
      ]);
      if (mounted) {
        // Keep the simulated delay just to not change behavior
        setTimeout(() => {
          if (mounted) {
            setPickups(loadedPickups);
            setProfile(loadedProfile);
            setLoading(false);
          }
        }, 350);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Persist changes
  useEffect(() => {
    if (!loading) {
      pickupApi.savePickups(pickups);
      if (profile) {
        pickupApi.saveProfile(profile);
      }
    }
  }, [pickups, profile, loading]);

  // Request a new pickup
  const requestPickup = useCallback(({ quantity, locality, timeWindow }) => {
    const tier = QUANTITY_TIERS.find(t => t.id === quantity);
    const newPickup = {
      id: `PU-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      quantity: tier?.label || quantity,
      status: 'Requested',
      pointsEarned: null,
      locality: locality,
      timeWindow: timeWindow,
    };
    setPickups(prev => [newPickup, ...prev]);
    return newPickup;
  }, []);

  // Get computed values
  const points = profile?.points || 0;
  const badge = getBadgeForPoints(points);
  const totalKgDiverted = profile?.totalKgDiverted || 0;

  const completedPickups = pickups.filter(p => p.status === 'Completed');
  const pendingPickups = pickups.filter(p => p.status === 'Requested' || p.status === 'Scheduled');

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
  };
}
