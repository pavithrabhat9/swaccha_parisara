import { useState, useEffect } from 'react';
import { webApiAdapter } from '../services/storageAdapter';

/**
 * Custom hook to detect browser online/offline status via WebApiAdapter.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => webApiAdapter.isOnline());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
