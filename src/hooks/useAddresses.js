import { useState, useEffect, useCallback } from 'react';
import { addressesApi } from '../services/addressesApi';
import { useAuth } from './useAuth';

/**
 * Hook for managing saved pickup addresses (used in Pickup and Profile).
 */
export function useAddresses() {
  const { user } = useAuth();
  const fallbackLocality = user?.locality || 'Kadri';
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await addressesApi.getAddresses(fallbackLocality);
      setAddresses(list);
    } catch (err) {
      setError(err?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [fallbackLocality]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const list = await addressesApi.getAddresses(fallbackLocality);
        if (mounted) {
          setAddresses(list);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load addresses');
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [fallbackLocality]);

  const persist = useCallback(async (nextList) => {
    setAddresses(nextList);
    await addressesApi.saveAddresses(nextList);
  }, []);

  const addAddress = useCallback(async ({ label, line, locality }) => {
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: label?.trim() || 'Address',
      line: line?.trim() || locality,
      locality: locality || 'Kadri',
      isDefault: addresses.length === 0,
    };
    const next = [...addresses, newAddr];
    await persist(next);
    return newAddr;
  }, [addresses, persist]);

  const updateAddress = useCallback(async (id, { label, line, locality }) => {
    const next = addresses.map(a =>
      a.id === id
        ? {
            ...a,
            label: label?.trim() || a.label,
            line: line?.trim() || a.line,
            locality: locality || a.locality,
          }
        : a
    );
    await persist(next);
  }, [addresses, persist]);

  const deleteAddress = useCallback(async (id) => {
    const filtered = addresses.filter(a => a.id !== id);
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
      filtered[0] = { ...filtered[0], isDefault: true };
    }
    await persist(filtered);
  }, [addresses, persist]);

  const setDefaultAddress = useCallback(async (id) => {
    const next = addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    await persist(next);
  }, [addresses, persist]);

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0] || null;

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    reloadAddresses: loadAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
