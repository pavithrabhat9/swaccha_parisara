import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { validateIdentifier, validatePassword } from '../utils/authUtils';

// STUB: simulated Google account. No real Google sign-in or token exchange happens anywhere.
const GOOGLE_STUB_USER = {
  name: 'Google User (sample)',
  email: 'citizen.sample@example.com',
  provider: 'google',
};
const GOOGLE_STUB_KEY = 'google:mock';

/**
 * Shared auth logic (consumed through AuthProvider / useAuth so every screen sees one session).
 *
 * Mock behaviour, all marked as stubs:
 *  - OTP: any 4 digits are accepted (the screen shows a hint). No SMS is sent.
 *  - Google: simulated, creates a sample identity.
 *  - Accounts: remembered locally (see authApi) so "log in" restores a previously created account.
 * Error results carry i18n keys in `error`; UI renders them with t().
 */
export function useAuthState() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'setup' | 'done'

  // Restore the persisted session or guest-mode choice on first load
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const [stored, guestMode] = await Promise.all([
        authApi.getUser(),
        authApi.getGuestMode(),
      ]);
      if (!mounted) return;
      if (stored && stored.name && stored.locality) {
        setUser(stored);
        setIsLoggedIn(true);
        setIsGuest(false);
        setAuthStep('done');
      } else if (guestMode) {
        setIsGuest(true);
      }
      setAuthLoading(false);
    };
    init();
    return () => { mounted = false; };
  }, []);

  const startSession = useCallback(async (account) => {
    setUser(account);
    setIsLoggedIn(true);
    setIsGuest(false);
    setAuthStep('done');
    await authApi.saveUser(account);
  }, []);

  const skipAuth = useCallback(async () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsGuest(true);
    setAuthStep('phone');
    await authApi.setGuestMode(true);
  }, []);

  // STUB: "sends" an OTP, only validates the number and advances the step
  const sendOtp = useCallback((phone) => {
    if (!phone || phone.length < 10) {
      return { success: false, error: 'auth_valid_phone_error' };
    }
    setUser({ phone });
    setAuthStep('otp');
    return { success: true };
  }, []);

  // STUB: accepts any 4 digits. Existing phone -> log in, new phone -> sign-up setup step.
  const verifyOtp = useCallback(async (code) => {
    if (!code || !/^\d{4}$/.test(code)) {
      return { success: false, error: 'auth_otp_invalid' };
    }
    const existing = await authApi.findAccount(user?.phone);
    if (existing) {
      await startSession(existing);
      return { success: true, isReturning: true };
    }
    setAuthStep('setup');
    return { success: true, isReturning: false };
  }, [user?.phone, startSession]);

  // STUB: simulated Google sign-in. Existing sample account -> log in, otherwise sign-up setup.
  const signInWithGoogle = useCallback(async () => {
    const existing = await authApi.findAccount(GOOGLE_STUB_KEY);
    if (existing) {
      await startSession(existing);
      return { success: true, isReturning: true };
    }
    setUser({ ...GOOGLE_STUB_USER });
    setAuthStep('setup');
    return { success: true, isReturning: false };
  }, [startSession]);

  // Credential login (phone or email + password)
  const loginWithCredentials = useCallback(async (identifier, password) => {
    const idCheck = validateIdentifier(identifier);
    if (!idCheck.valid) {
      return { success: false, error: idCheck.error };
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return { success: false, error: pwCheck.error };
    }
    const result = await authApi.authenticateAccount(idCheck.normalized, password);
    if (!result.success) {
      return result;
    }
    setUser(result.user);
    setIsLoggedIn(true);
    setIsGuest(false);
    setAuthStep('done');
    return { success: true, user: result.user };
  }, []);

  // Credential sign-up (name, phone, optional email, locality, password)
  const signUpWithCredentials = useCallback(async ({ name, phone, email, locality, password }) => {
    if (!name?.trim()) {
      return { success: false, error: 'auth_name_required' };
    }
    const phoneCheck = validateIdentifier(phone);
    if (!phoneCheck.valid || phoneCheck.kind !== 'phone') {
      return { success: false, error: 'auth_valid_phone_error' };
    }
    if (email && email.trim()) {
      const emailCheck = validateIdentifier(email);
      if (!emailCheck.valid || emailCheck.kind !== 'email') {
        return { success: false, error: 'auth_email_invalid' };
      }
    }
    if (!locality) {
      return { success: false, error: 'auth_locality_required' };
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return { success: false, error: pwCheck.error };
    }
    const result = await authApi.registerAccount({
      name: name.trim(),
      phone: phoneCheck.normalized,
      email: email?.trim() || '',
      locality,
      password,
    });
    if (!result.success) {
      return result;
    }
    setUser(result.user);
    setIsLoggedIn(true);
    setIsGuest(false);
    setAuthStep('done');
    return { success: true, user: result.user };
  }, []);

  // Forgot password step 1: verify account exists
  const checkAccountExists = useCallback(async (identifier) => {
    const idCheck = validateIdentifier(identifier);
    if (!idCheck.valid) {
      return { success: false, error: idCheck.error };
    }
    const account = await authApi.findAccount(idCheck.normalized);
    if (!account) {
      return { success: false, error: 'auth_account_not_found' };
    }
    return { success: true, identifier: idCheck.normalized };
  }, []);

  // Forgot password step 2: set new password
  const resetPassword = useCallback(async (identifier, newPassword) => {
    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      return { success: false, error: pwCheck.error };
    }
    return authApi.resetPassword(identifier, newPassword);
  }, []);

  // Complete first-time sign-up (Google setup step)
  const completeSetup = useCallback((name, locality, accountType = 'individual') => {
    if (!name?.trim()) {
      return { success: false, error: 'auth_name_required' };
    }
    if (!locality) {
      return { success: false, error: 'auth_locality_required' };
    }
    const fullUser = { ...user, name: name.trim(), locality, accountType };
    startSession(fullUser);
    return { success: true };
  }, [user, startSession]);

  // Update an existing profile (used by the Profile page)
  const updateProfile = useCallback(async (updates) => {
    const trimmedName = updates?.name?.trim();
    const cleanedPhone = String(updates?.phone ?? user?.phone ?? '').replace(/\D/g, '').slice(0, 10);
    const nextLocality = updates?.locality || user?.locality;

    if (!trimmedName) {
      return { success: false, error: 'auth_name_required' };
    }
    // Phone is required, except for the simulated Google identity which has none
    if ((cleanedPhone && cleanedPhone.length < 10) || (!cleanedPhone && user?.provider !== 'google')) {
      return { success: false, error: 'auth_valid_phone_error' };
    }
    if (!nextLocality) {
      return { success: false, error: 'auth_locality_required' };
    }

    const updatedUser = {
      ...user,
      name: trimmedName,
      phone: cleanedPhone,
      locality: nextLocality,
      ...(updates?.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
    };
    setUser(updatedUser);
    await authApi.saveUser(updatedUser);
    return { success: true, user: updatedUser };
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setIsGuest(false);
    setAuthStep('phone');
    authApi.removeUser();
  }, []);

  const accountType = user?.accountType || 'individual';

  return {
    user,
    isLoggedIn,
    isGuest,
    authLoading,
    authStep,
    setAuthStep,
    accountType,
    isBusinessAccount: accountType === 'business',
    sendOtp,
    verifyOtp,
    signInWithGoogle,
    loginWithCredentials,
    signUpWithCredentials,
    checkAccountExists,
    resetPassword,
    completeSetup,
    skipAuth,
    updateProfile,
    logout,
  };
}

