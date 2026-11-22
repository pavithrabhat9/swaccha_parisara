/**
 * StorageAdapter & WebApiAdapter — Hexagonal Ports & Adapters Layer (`architecture-patterns`).
 *
 * Centralizes all browser persistence (`localStorage`), cross-service reactive change events,
 * and Web APIs (`navigator.geolocation`, `navigator.permissions`, `navigator.onLine`, `FileReader`)
 * behind a resilient, testable port that works seamlessly in both browsers and Node (`node --test`).
 */

export const STORAGE_KEYS = Object.freeze({
  AUTH_SESSION: 'swachha_auth',
  ACCOUNTS: 'swachha_accounts',
  ONBOARDING_SEEN: 'swachha_onboarding_seen',
  PICKUPS: 'swachha_pickups',
  PROFILE: 'swachha_profile',
  REPORTS: 'swachha_reports',
  OFFLINE_REPORTS_QUEUE: 'swachha_reports_offline_queue',
  BUSINESS: 'swachha_business',
  ADDRESSES: 'swachha_addresses',
  DONATIONS: 'swachha_donations',
  NOTIFICATIONS_STATE: 'swachha_notifications_state',
  NOTIFICATIONS_READ: 'swachha_notifications_read',
  NOTIFICATION_PREFS: 'swachha_notification_prefs',
  LANGUAGE: 'swachha_lang',
});

export const DEMO_USER_KEY = '9876543210';

const memoryFallbackStore = new Map();
const changeListeners = new Set();

function hasLocalStorage() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export const storageAdapter = {
  /**
   * Read and JSON-parse a value by key, returning `fallback` on missing or corrupt JSON.
   */
  get(key, fallback = null) {
    try {
      if (hasLocalStorage()) {
        const raw = window.localStorage.getItem(key);
        if (raw === null || raw === undefined) {
          if (!memoryFallbackStore.has(key)) return fallback;
          const memVal = memoryFallbackStore.get(key);
          return typeof memVal === 'string' ? JSON.parse(memVal) : memVal;
        }
        return JSON.parse(raw);
      }
      if (memoryFallbackStore.has(key)) {
        const memVal = memoryFallbackStore.get(key);
        return typeof memVal === 'string' ? JSON.parse(memVal) : memVal;
      }
    } catch {
      // Corrupted JSON falls back cleanly to default value
    }
    return fallback;
  },

  /**
   * Read a raw string value without JSON parsing.
   */
  getRaw(key, fallback = null) {
    try {
      if (hasLocalStorage()) {
        const raw = window.localStorage.getItem(key);
        if (raw !== null && raw !== undefined) return raw;
      }
    } catch {
      // Ignore storage read failure
    }
    return memoryFallbackStore.has(key) ? String(memoryFallbackStore.get(key)) : fallback;
  },

  /**
   * Serialize and persist a value to `localStorage` + in-memory fallback.
   */
  set(key, value) {
    memoryFallbackStore.set(key, value);
    try {
      if (hasLocalStorage()) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // QuotaExceededError or private-browsing block — safely retained in memoryFallbackStore
    }
    this.emitChange(key);
    return value;
  },

  /**
   * Persist a raw string value to `localStorage`.
   */
  setRaw(key, rawString) {
    memoryFallbackStore.set(key, rawString);
    try {
      if (hasLocalStorage()) {
        window.localStorage.setItem(key, String(rawString));
      }
    } catch {
      // Retained in memoryFallbackStore
    }
    this.emitChange(key);
    return rawString;
  },

  /**
   * Remove a key from both `localStorage` and the in-memory store.
   */
  remove(key) {
    memoryFallbackStore.delete(key);
    try {
      if (hasLocalStorage()) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore removal error
    }
    this.emitChange(key);
  },

  /**
   * Clear all keys (used by test runner and dev reset).
   */
  clear() {
    memoryFallbackStore.clear();
    try {
      if (hasLocalStorage()) {
        window.localStorage.clear();
      }
    } catch {
      // Ignore clear error
    }
    this.emitChange('*');
  },

  /**
   * Notify in-tab subscribers when any service mutates persisted data.
   */
  emitChange(key = '*') {
    changeListeners.forEach((fn) => {
      try {
        fn(key);
      } catch {
        // Ignore listener error
      }
    });
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent('swachha:data-changed', { detail: { key } }));
      } catch {
        // Ignore event error
      }
    }
  },

  /**
   * Subscribe to any in-tab or cross-tab data changes.
   */
  subscribeChanges(callback) {
    changeListeners.add(callback);
    const onStorage = (event) => callback(event?.key || '*');
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', onStorage);
    }
    return () => {
      changeListeners.delete(callback);
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('storage', onStorage);
      }
    };
  },

  /**
   * Resolve the active user's storage scope key from the current session.
   */
  getCurrentUserKey() {
    const user = this.get(STORAGE_KEYS.AUTH_SESSION, null);
    if (!user) return DEMO_USER_KEY;
    if (user.provider === 'google') return 'google:mock';
    return user.phone || DEMO_USER_KEY;
  },

  /**
   * Build a user-scoped storage key (`<baseKey>:<userKey>`).
   */
  scopedKey(baseKey) {
    const userKey = this.getCurrentUserKey();
    return `${baseKey}:${userKey}`;
  },
};

/**
 * WebApiAdapter — Safe, promise-based wrapper around browser hardware & network APIs.
 */
export const webApiAdapter = {
  isOnline() {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  },

  async checkCameraPermission() {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
      return 'prompt';
    }
    try {
      const status = await navigator.permissions.query({ name: 'camera' });
      return status.state;
    } catch {
      return 'prompt';
    }
  },

  getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }) {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        options
      );
    });
  },

  readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
};
