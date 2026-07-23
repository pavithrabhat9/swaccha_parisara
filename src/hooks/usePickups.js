import { useState, useCallback, useEffect } from 'react';
import { mockPickupHistory, mockUserProfile, getBadgeForPoints, QUANTITY_TIERS } from '../data/mockPickups';

const PICKUP_STORAGE_KEY = 'swachha_pickups';
const PROFILE_STORAGE_KEY = 'swachha_profile';

function loadPickups() {
  try {
    const stored = localStorage.getItem(PICKUP_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [...mockPickupHistory];
}

function loadProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { ...mockUserProfile };
}

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
    const timer = setTimeout(() => {
      setPickups(loadPickups());
      setProfile(loadProfile());
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Persist changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(PICKUP_STORAGE_KEY, JSON.stringify(pickups));
      if (profile) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
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
