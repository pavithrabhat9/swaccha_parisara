import { storageAdapter, STORAGE_KEYS } from './storageAdapter';
import { normalizeIdentifier } from '../utils/authUtils';

/**
 * Identifier an account is stored under.
 * STUB: a real backend (Supabase) would use the auth user id instead.
 */
export const accountKeyFor = (user) => {
  if (user?.provider === 'google') return 'google:mock';
  return user?.phone || user?.email?.toLowerCase() || null;
};

const readAccounts = () => {
  const accounts = storageAdapter.get(STORAGE_KEYS.ACCOUNTS, {});
  return accounts && typeof accounts === 'object' ? accounts : {};
};

const stripSecret = (account) => {
  if (!account) return null;
  const { password: _password, ...safeUser } = account;
  return safeUser;
};

const findEntryByIdentifier = (accounts, rawIdentifier) => {
  const normalized = normalizeIdentifier(rawIdentifier);
  if (!normalized) return null;
  if (accounts[normalized]) {
    return { key: normalized, account: accounts[normalized] };
  }
  for (const [key, account] of Object.entries(accounts)) {
    if (!account) continue;
    if (account.phone && normalizeIdentifier(account.phone) === normalized) {
      return { key, account };
    }
    if (account.email && account.email.toLowerCase() === normalized) {
      return { key, account };
    }
  }
  return null;
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
    const safeUser = stripSecret(user);
    storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
    storageAdapter.set(STORAGE_KEYS.AUTH_SESSION, safeUser);
    const key = accountKeyFor(safeUser);
    if (key && safeUser?.name) {
      const accounts = readAccounts();
      const existing = accounts[key];
      accounts[key] = { ...(existing || {}), ...safeUser };
      storageAdapter.set(STORAGE_KEYS.ACCOUNTS, accounts);
    }
    return safeUser;
  },

  /** Looks up a previously created account (returning user login). */
  findAccount: async (key) => {
    if (!key) return null;
    const accounts = readAccounts();
    if (accounts[key]) return stripSecret(accounts[key]);
    const matched = findEntryByIdentifier(accounts, key);
    return matched ? stripSecret(matched.account) : null;
  },

  /** Registers a new local mock account with phone/email + password. */
  registerAccount: async ({ name, phone, email, locality, password, accountType = 'individual' }) => {
    const accounts = readAccounts();
    const cleanPhone = normalizeIdentifier(phone);
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    if (cleanPhone && findEntryByIdentifier(accounts, cleanPhone)) {
      return { success: false, error: 'auth_account_exists' };
    }
    if (cleanEmail && findEntryByIdentifier(accounts, cleanEmail)) {
      return { success: false, error: 'auth_account_exists' };
    }

    const account = {
      name: String(name || '').trim(),
      phone: cleanPhone,
      ...(cleanEmail ? { email: cleanEmail } : {}),
      locality,
      accountType,
      provider: 'password',
      password,
    };

    const key = accountKeyFor(account);
    if (!key) {
      return { success: false, error: 'auth_identifier_required' };
    }

    accounts[key] = account;
    storageAdapter.set(STORAGE_KEYS.ACCOUNTS, accounts);

    const safeUser = stripSecret(account);
    storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
    storageAdapter.set(STORAGE_KEYS.AUTH_SESSION, safeUser);
    return { success: true, user: safeUser };
  },

  /** Authenticates an existing account by phone or email + password. */
  authenticateAccount: async (identifier, password) => {
    const accounts = readAccounts();
    const matched = findEntryByIdentifier(accounts, identifier);
    if (!matched) {
      return { success: false, error: 'auth_invalid_credentials' };
    }
    if (matched.account.password && matched.account.password !== password) {
      return { success: false, error: 'auth_invalid_credentials' };
    }
    const safeUser = stripSecret(matched.account);
    storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
    storageAdapter.set(STORAGE_KEYS.AUTH_SESSION, safeUser);
    return { success: true, user: safeUser };
  },

  /** Updates the password for an existing account (mock forgot-password flow). */
  resetPassword: async (identifier, newPassword) => {
    const accounts = readAccounts();
    const matched = findEntryByIdentifier(accounts, identifier);
    if (!matched) {
      return { success: false, error: 'auth_account_not_found' };
    }
    accounts[matched.key] = { ...matched.account, password: newPassword };
    storageAdapter.set(STORAGE_KEYS.ACCOUNTS, accounts);
    return { success: true };
  },

  /** Ends the session and clears guest mode so sign-out returns to the login screen. */
  removeUser: async () => {
    storageAdapter.remove(STORAGE_KEYS.AUTH_SESSION);
    storageAdapter.remove(STORAGE_KEYS.AUTH_GUEST_MODE);
  },
};
