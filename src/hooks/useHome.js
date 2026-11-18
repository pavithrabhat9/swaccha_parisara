import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { homeApi } from '../services/homeApi';
import { getGreetingKey, getInitials } from '../utils/homeUtils';

/**
 * Logic for the Home tab: greeting, contribution summary, upcoming pickups,
 * notification inbox (with read state) and Learn highlights.
 */
export function useHome() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: false, data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await homeApi.getOverview();
        if (mounted) setState({ loading: false, error: false, data });
      } catch {
        if (mounted) setState({ loading: false, error: true, data: null });
      }
    };
    load();
    return () => { mounted = false; };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ loading: true, error: false, data: null });
    setAttempt(prev => prev + 1);
  }, []);

  const notifications = state.data?.notifications;

  const markNotificationsRead = useCallback(async (ids) => {
    if (!ids.length) return;
    await homeApi.markNotificationsRead(ids);
    setState(prev =>
      prev.data
        ? {
            ...prev,
            data: {
              ...prev.data,
              notifications: prev.data.notifications.map(n =>
                ids.includes(n.id) ? { ...n, unread: false } : n
              ),
            },
          }
        : prev
    );
  }, []);

  const markAllRead = useCallback(() => {
    const ids = (notifications || []).filter(n => n.unread).map(n => n.id);
    return markNotificationsRead(ids);
  }, [notifications, markNotificationsRead]);

  const markRead = useCallback((id) => markNotificationsRead([id]), [markNotificationsRead]);

  const greetingKey = useMemo(() => getGreetingKey(), []);
  const unreadCount = (notifications || []).filter(n => n.unread).length;

  return {
    loading: state.loading,
    error: state.error,
    retry,
    firstName: user?.name?.split(' ')[0] || '',
    initials: getInitials(user?.name),
    greetingKey,
    summary: state.data?.summary || null,
    isNewUser: Boolean(state.data?.isNewUser),
    upcoming: state.data?.upcoming || [],
    learn: state.data?.learn || [],
    notifications: notifications || [],
    unreadCount,
    markAllRead,
    markRead,
  };
}
