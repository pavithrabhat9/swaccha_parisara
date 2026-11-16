import { useState, useEffect, useCallback } from 'react';
import { onboardingApi } from '../services/onboardingApi';

/**
 * First-launch onboarding flag. `loading` is true until the stored flag has been read.
 */
export function useOnboarding() {
  const [seen, setSeen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const alreadySeen = await onboardingApi.hasSeen();
      if (mounted) {
        setSeen(alreadySeen);
        setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const complete = useCallback(async () => {
    await onboardingApi.markSeen();
    setSeen(true);
  }, []);

  return { seen, loading, complete };
}

