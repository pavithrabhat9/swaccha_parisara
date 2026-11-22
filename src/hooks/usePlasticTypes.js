import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { learnApi } from '../services/learnApi';
import { useNetworkStatus } from './useNetworkStatus';
import { usePrefersReducedMotion } from './useMotion';
import {
  PLASTIC_FILTER_OPTIONS,
  getPlasticCategory,
  getRecyclabilityStatus,
  filterPlasticTypes,
  normalizePlasticCodeParam,
  getPlasticAnchorId,
} from '../utils/plasticTypesUtils';

export { PLASTIC_FILTER_OPTIONS, getPlasticCategory, getRecyclabilityStatus };

/**
 * Hook for the /learn/plastic-types ("Know Your Plastic") article-style guide.
 * Fetches guide content via `learnApi`, manages category filtering, URL/hash deep-link
 * scrolling (respecting reduced motion), back navigation, and offline/retry states.
 */
export function usePlasticTypes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isOffline } = useNetworkStatus();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCode, setSelectedCode] = useState(null);
  const pendingScrollCodeRef = useRef(null);
  const mountedRef = useRef(true);

  const urlTargetCode = normalizePlasticCodeParam(
    searchParams.get('code') || searchParams.get('type') || location.hash
  );
  const activeCode = selectedCode ?? urlTargetCode;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await learnApi.getPlasticTypesGuide();
      if (mountedRef.current) {
        setGuide(data);
        setLoading(false);
      }
    } catch {
      if (mountedRef.current) {
        setError(true);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const data = await learnApi.getPlasticTypesGuide();
        if (active) {
          setGuide(data);
          setLoading(false);
        }
      } catch {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  const performScrollToCode = useCallback(
    (code) => {
      if (typeof document === 'undefined') return;
      const el = document.getElementById(getPlasticAnchorId(code));
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [prefersReducedMotion]
  );

  // Deep-link DOM scroll sync: ?code=1 | ?type=pet | #resin-5
  useEffect(() => {
    if (loading || !guide || !urlTargetCode) return undefined;
    const frameId = requestAnimationFrame(() => {
      performScrollToCode(urlTargetCode);
    });
    return () => cancelAnimationFrame(frameId);
  }, [loading, guide, urlTargetCode, performScrollToCode]);

  // Execute deferred scroll after resetting filter back to 'all'
  useEffect(() => {
    if (pendingScrollCodeRef.current && activeFilter === 'all') {
      const code = pendingScrollCodeRef.current;
      pendingScrollCodeRef.current = null;
      const frameId = requestAnimationFrame(() => {
        performScrollToCode(code);
      });
      return () => cancelAnimationFrame(frameId);
    }
    return undefined;
  }, [activeFilter, performScrollToCode]);

  const allTypes = useMemo(() => guide?.types || [], [guide]);

  const filteredItems = useMemo(
    () => filterPlasticTypes(allTypes, activeFilter),
    [allTypes, activeFilter]
  );

  const scrollToCode = useCallback(
    (code) => {
      const numeric = Number(code);
      if (!numeric || numeric < 1 || numeric > 7) return;
      setSelectedCode(numeric);

      const isCurrentlyVisible = filteredItems.some((item) => item.code === numeric);
      if (!isCurrentlyVisible && activeFilter !== 'all') {
        pendingScrollCodeRef.current = numeric;
        setActiveFilter('all');
        return;
      }
      performScrollToCode(numeric);
    },
    [filteredItems, activeFilter, performScrollToCode]
  );

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && (window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  }, [navigate]);

  return {
    guide,
    allTypes,
    items: filteredItems,
    loading,
    error,
    isOffline,
    activeFilter,
    setActiveFilter,
    activeCode,
    scrollToCode,
    goBack,
    retry: load,
  };
}
