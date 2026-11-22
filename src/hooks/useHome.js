import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { homeApi } from '../services/homeApi';
import { storageAdapter } from '../services/storageAdapter';
import { getGreetingKey, getFirstName, getInitials } from '../utils/homeUtils';

const ONE_HOUR_MS = 3600 * 1000;

/**
 * Logic for the Home tab: greeting, contribution summary, upcoming pickups,
 * notification inbox (with read/delete state), and Learn highlights.
 * Automatically refreshes when returning to the tab, when other tabs mutate data,
 * or after 1 hour of inactivity.
 */
export function useHome() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: false, data: null });
  const [greetingKey, setGreetingKey] = useState(() => getGreetingKey());
  const lastLoadedAtRef = useRef(0);
  const inFlightOpsRef = useRef(new Set());

  const userKey = user?.provider === 'google' ? 'google:mock' : (user?.phone || '');

  const fetchOverview = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setState((prev) => ({ ...prev, loading: true, error: false }));
    }
    try {
      const data = await homeApi.getOverview();
      lastLoadedAtRef.current = Date.now();
      setGreetingKey(getGreetingKey());
      setState({ loading: false, error: false, data });
    } catch {
      if (!silent) {
        setState({ loading: false, error: true, data: null });
      }
    }
  }, []);

  // Initial load & reload when the logged-in user changes
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const data = await homeApi.getOverview();
        if (mounted) {
          lastLoadedAtRef.current = Date.now();
          setGreetingKey(getGreetingKey());
          setState({ loading: false, error: false, data });
        }
      } catch {
        if (mounted) {
          setState({ loading: false, error: true, data: null });
        }
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [userKey]);

  // Subscribe to cross-tab / cross-service data mutations & visibility/focus refresh
  useEffect(() => {
    const unsubscribe = storageAdapter.subscribeChanges(() => {
      fetchOverview({ silent: true });
    });

    const onVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      setGreetingKey(getGreetingKey());
      fetchOverview({ silent: true });
    };

    const hourlyTimer = setInterval(() => {
      setGreetingKey(getGreetingKey());
      if (Date.now() - lastLoadedAtRef.current >= ONE_HOUR_MS) {
        fetchOverview({ silent: true });
      }
    }, 60 * 1000);

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onVisibilityOrFocus);
      document.addEventListener('visibilitychange', onVisibilityOrFocus);
    }

    return () => {
      unsubscribe();
      clearInterval(hourlyTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onVisibilityOrFocus);
        document.removeEventListener('visibilitychange', onVisibilityOrFocus);
      }
    };
  }, [fetchOverview]);

  const retry = useCallback(() => {
    fetchOverview({ silent: false });
  }, [fetchOverview]);

  const notifications = state.data?.notifications;

  const markNotificationsRead = useCallback(async (ids) => {
    if (!ids?.length) return;
    const opKey = `read:${ids.join(',')}`;
    if (inFlightOpsRef.current.has(opKey)) return;
    inFlightOpsRef.current.add(opKey);
    try {
      const updated = await homeApi.markNotificationsRead(ids);
      setState((prev) =>
        prev.data
          ? {
              ...prev,
              data: {
                ...prev.data,
                notifications: Array.isArray(updated)
                  ? updated
                  : prev.data.notifications.map((n) =>
                      ids.includes(n.id) ? { ...n, unread: false } : n
                    ),
              },
            }
          : prev
      );
    } finally {
      inFlightOpsRef.current.delete(opKey);
    }
  }, []);

  const markAllRead = useCallback(() => {
    const ids = (notifications || []).filter((n) => n.unread).map((n) => n.id);
    return markNotificationsRead(ids);
  }, [notifications, markNotificationsRead]);

  const markRead = useCallback((id) => markNotificationsRead([id]), [markNotificationsRead]);

  const deleteNotification = useCallback(async (id) => {
    if (!id) return;
    const opKey = `del:${id}`;
    if (inFlightOpsRef.current.has(opKey)) return;
    inFlightOpsRef.current.add(opKey);
    try {
      const updated = await homeApi.deleteNotification(id);
      setState((prev) =>
        prev.data
          ? {
              ...prev,
              data: {
                ...prev.data,
                notifications: Array.isArray(updated)
                  ? updated
                  : prev.data.notifications.filter((n) => n.id !== id),
              },
            }
          : prev
      );
    } finally {
      inFlightOpsRef.current.delete(opKey);
    }
  }, []);

  const unreadCount = (notifications || []).filter((n) => n.unread).length;
  const fallbackFirstName = t('home_default_resident', { defaultValue: 'Resident' });

  return {
    loading: state.loading,
    error: state.error,
    retry,
    refresh: () => fetchOverview({ silent: true }),
    firstName: getFirstName(user?.name, fallbackFirstName),
    initials: getInitials(user?.name),
    avatarUrl: user?.avatarUrl || '',
    greetingKey,
    summary: state.data?.summary || null,
    isNewUser: Boolean(state.data?.isNewUser),
    upcoming: state.data?.upcoming || [],
    learn: state.data?.learn || [],
    learnError: Boolean(state.data?.learnError),
    notifications: notifications || [],
    unreadCount,
    markAllRead,
    markRead,
    deleteNotification,
  };
}
