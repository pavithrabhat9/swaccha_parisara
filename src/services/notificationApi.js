import { MOCK_NOTIFICATIONS } from '../data/mockHome';
import { storageAdapter, STORAGE_KEYS, DEMO_USER_KEY } from './storageAdapter';
import { preferencesApi } from './preferencesApi';
import { devControls } from './devControls';

/**
 * Checks whether a notification type is enabled by the user's Profile notification preferences:
 * - 'pickup' | 'points' -> `pickupUpdates`
 * - 'report' -> `reportStatus`
 * - 'ngo' -> `ngoNews`
 */
function isCategoryEnabled(type, prefs) {
  if (!prefs) return true;
  if (type === 'pickup' || type === 'points') return Boolean(prefs.pickupUpdates);
  if (type === 'report') return Boolean(prefs.reportStatus);
  if (type === 'ngo') return Boolean(prefs.ngoNews);
  return true;
}

function buildSeededNotifications() {
  const now = Date.now();
  return MOCK_NOTIFICATIONS.map((n) => ({
    id: n.id,
    type: n.type,
    targetId: n.targetId || null,
    title: n.title,
    body: n.body,
    createdAt: new Date(now - n.hoursAgo * 3600 * 1000).toISOString(),
    unread: Boolean(n.unread),
  }));
}

function readRawNotifications() {
  const userKey = storageAdapter.getCurrentUserKey();
  const key = storageAdapter.scopedKey(STORAGE_KEYS.NOTIFICATIONS_STATE);
  const stored = storageAdapter.get(key, null);

  if (Array.isArray(stored)) {
    return stored;
  }

  // Only the returning demo user (`9876543210`) starts with seeded notifications; new users start empty.
  const initial = userKey === DEMO_USER_KEY ? buildSeededNotifications() : [];
  storageAdapter.set(key, initial);
  return initial;
}

function writeRawNotifications(list) {
  const key = storageAdapter.scopedKey(STORAGE_KEYS.NOTIFICATIONS_STATE);
  return storageAdapter.set(key, list);
}

/**
 * Notification service:
 * - list, getUnreadCount, markRead, markAllRead, deleteNotification, createNotification
 * - Respects Profile notification preferences (`pickupUpdates`, `reportStatus`, `ngoNews`)
 * - User-scoped so signing out and in as another user never leaks notifications.
 */
export const notificationApi = {
  list: async () => {
    await devControls.applyServiceSimulation('notifications', 120);
    const [raw, prefs] = await Promise.all([
      Promise.resolve(readRawNotifications()),
      preferencesApi.getPreferences(),
    ]);
    return raw.filter((n) => n && isCategoryEnabled(n.type, prefs));
  },

  getUnreadCount: async () => {
    const visible = await notificationApi.list();
    return visible.filter((n) => n.unread).length;
  },

  markRead: async (id) => {
    if (!id) return notificationApi.list();
    const ids = Array.isArray(id) ? id : [id];
    const current = readRawNotifications();
    let changed = false;
    const next = current.map((n) => {
      if (ids.includes(n.id) && n.unread) {
        changed = true;
        return { ...n, unread: false };
      }
      return n;
    });
    if (changed) {
      writeRawNotifications(next);
    }
    return notificationApi.list();
  },

  markAllRead: async () => {
    const current = readRawNotifications();
    let changed = false;
    const next = current.map((n) => {
      if (n.unread) {
        changed = true;
        return { ...n, unread: false };
      }
      return n;
    });
    if (changed) {
      writeRawNotifications(next);
    }
    return notificationApi.list();
  },

  deleteNotification: async (id) => {
    if (!id) return notificationApi.list();
    const current = readRawNotifications();
    const next = current.filter((n) => n.id !== id);
    if (next.length !== current.length) {
      writeRawNotifications(next);
    }
    return notificationApi.list();
  },

  createNotification: async ({ type = 'pickup', targetId = null, title, body }) => {
    const prefs = await preferencesApi.getPreferences();
    if (!isCategoryEnabled(type, prefs)) {
      return null;
    }
    const current = readRawNotifications();
    const item = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      targetId,
      title,
      body,
      createdAt: new Date().toISOString(),
      unread: true,
    };
    writeRawNotifications([item, ...current]);
    return item;
  },
};

