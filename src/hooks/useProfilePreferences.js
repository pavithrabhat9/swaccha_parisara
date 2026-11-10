import { useState, useEffect, useCallback } from 'react';
import { preferencesApi } from '../services/preferencesApi';

/**
 * Hook for managing user notification preferences on the Profile page.
 */
export function useProfilePreferences() {
  const [preferences, setPreferences] = useState({
    pickupUpdates: true,
    reportStatus: true,
    ngoNews: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const loaded = await preferencesApi.getPreferences();
        if (mounted) {
          setPreferences(loaded);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load preferences');
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const reloadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await preferencesApi.getPreferences();
      setPreferences(loaded);
    } catch (err) {
      setError(err?.message || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePreference = useCallback(async (key) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      preferencesApi.savePreferences(updated);
      return updated;
    });
  }, []);

  return {
    preferences,
    loading,
    error,
    togglePreference,
    reloadPreferences,
  };
}
