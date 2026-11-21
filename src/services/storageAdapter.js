/**
 * StorageAdapter & WebApiAdapter — Hexagonal Ports & Adapters Layer (`architecture-patterns`).
 *
 * Centralizes all browser persistence (`localStorage`) and Web APIs (`navigator.geolocation`,
 * `navigator.permissions`, `navigator.onLine`, `FileReader`) behind a resilient, testable
 * port with automatic in-memory fallback when `localStorage` is unavailable or quota-exceeded.
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
  NOTIFICATIONS_READ: 'swachha_notifications_read',
  NOTIFICATION_PREFS: 'swachha_notification_prefs',
  LANGUAGE: 'swachha_lang',
});

const memoryFallbackStore = new Map();

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
          return memoryFallbackStore.has(key) ? memoryFallbackStore.get(key) : fallback;
        }
        return JSON.parse(raw);
      }
    } catch {
      // Fallback to in-memory store or default value
    }
    return memoryFallbackStore.has(key) ? memoryFallbackStore.get(key) : fallback;
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
  },

  /**
   * Subscribe to cross-tab storage updates for a specific key.
   */
  subscribe(key, callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (event) => {
      if (event.key === key) {
        try {
          callback(event.newValue ? JSON.parse(event.newValue) : null);
        } catch {
          callback(event.newValue);
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
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

