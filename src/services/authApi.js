import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

/**
 * Identifier an account is stored under.
 * STUB: a real backend (Supabase) would use the auth user id instead.
 */
export const accountKeyFor = (user) => {
  if (user?.provider === 'google') return 'google:mock';
  return user?.phone || null;
};

const readAccounts = () => {
  const accounts = storageAdapter.get(STORAGE_KEYS.ACCOUNTS, {});
  return accounts && typeof accounts === 'object' ? accounts : {};
};

export const authApi = {
  /** Current session user (null when logged out). */
  getUser: async () => {
    return storageAdapter.get(STORAGE_KEYS.AUTH_SESSION, null);
  },

  /** Whether the user previously skipped login to continue as a guest. */
  getGuestMode: async () => {
    return storageAdapter.getRaw(STORAGE_KEYS.AUTH_GUEST_MODE) === '1';
  },

  /** Remembers or clears the user's guest-mode skip choice. */
  setGuestMode: async (enabled) => {
    if (enabled) {
      storageAdapter.setRaw(STORAGE_KEYS.AUTH_GUEST_MODE, '1');
    } else {
      storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
    }
  },

  /**
   * Saves the session user and, once the profile is complete, remembers the account
   * so logging in again with the same phone / Google identity restores it.
   */
  saveUser: async (user) => {
    storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
    storageAdapter.set(STORAGE_KEYS.AUTH_SESSION, user);
    const key = accountKeyFor(user);
    if (key && user?.name) {
      const accounts = readAccounts();
      accounts[key] = user;
      storageAdapter.set(STORAGE_KEYS.ACCOUNTS, accounts);
    }
    return user;
  },

  /** Looks up a previously created account (returning user login). */
  findAccount: async (key) => {
    if (!key) return null;
    return readAccounts()[key] || null;
  },

  /** Ends the session and clears guest mode so sign-out returns to the login screen. */
  removeUser: async () => {
    storageAdapter.remove(STORAGE_KEYS.AUTH_SESSION);
    storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
  },
};
