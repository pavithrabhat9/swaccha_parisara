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

  /**
   * Saves the session user and, once the profile is complete, remembers the account
   * so logging in again with the same phone / Google identity restores it.
   */
  saveUser: async (user) => {
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

  /** Ends the session only; the account stays registered for the next login. */
  removeUser: async () => {
    storageAdapter.remove(STORAGE_KEYS.AUTH_SESSION);
  },
};
