const AUTH_STORAGE_KEY = 'swachha_auth';
const ACCOUNTS_STORAGE_KEY = 'swachha_accounts';

/**
 * Identifier an account is stored under.
 * STUB: a real backend (Supabase) would use the auth user id instead.
 */
export const accountKeyFor = (user) => {
  if (user?.provider === 'google') return 'google:mock';
  return user?.phone || null;
};

const readAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export const authApi = {
  /** Current session user (null when logged out). */
  getUser: async () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },

  /**
   * Saves the session user and, once the profile is complete, remembers the account
   * so logging in again with the same phone / Google identity restores it.
   * STUB: local-only account registry that mimics a server-side users table.
   */
  saveUser: async (user) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      const key = accountKeyFor(user);
      if (key && user?.name) {
        const accounts = readAccounts();
        accounts[key] = user;
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      }
    } catch { /* ignore storage errors */ }
    return user;
  },

  /** Looks up a previously created account (returning user login). */
  findAccount: async (key) => {
    if (!key) return null;
    return readAccounts()[key] || null;
  },

  /** Ends the session only; the account stays registered for the next login. */
  removeUser: async () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch { /* ignore storage errors */ }
  },
};
