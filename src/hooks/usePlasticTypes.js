import { useState, useEffect, useMemo, useCallback } from 'react';
import { plasticTypes } from '../data/learnContent';
import { delay } from '../utils/asyncUtils';

export const PLASTIC_FILTER_OPTIONS = [
  { id: 'all', labelKey: 'kyp_filter_all' },
  { id: 'recyclable', labelKey: 'kyp_filter_recyclable' },
  { id: 'special', labelKey: 'kyp_filter_special' },
  { id: 'not_recyclable', labelKey: 'kyp_filter_not_recyclable' },
];

/**
 * Normalizes a plasticType entry's `recyclable` value ('yes' | 'limited' | 'special' | 'no')
 * into one of the 3 filter categories: 'recyclable' | 'special' | 'not_recyclable'.
 */
export function getPlasticCategory(recyclableValue) {
  if (recyclableValue === 'yes') return 'recyclable';
  if (recyclableValue === 'special' || recyclableValue === 'limited') return 'special';
  return 'not_recyclable';
}

/**
 * Hook for the /learn/plastic-types ("Know your plastic") page.
 * Reuses `plasticTypes` from `src/data/learnContent.js` directly without duplicating data.
 */
export function usePlasticTypes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(180);
      setItems(plasticTypes);
    } catch (err) {
      setError(err?.message || 'Failed to load plastic types');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await delay(180);
        if (mounted) {
          setItems(plasticTypes);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load plastic types');
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter(p => getPlasticCategory(p.recyclable) === activeFilter);
  }, [items, activeFilter]);

  return {
    items: filteredItems,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    retry: load,
  };
}

