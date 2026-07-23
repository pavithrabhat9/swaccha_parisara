import { useState, useCallback, useEffect } from 'react';

const AUTH_STORAGE_KEY = 'swaccha_auth';

/**
 * Lightweight phone auth stub for Phase 0.
 * Accepts any 4-digit OTP (demo mode — the "correct" code is always 1234, shown to user).
 * Session persists in localStorage so refreshing doesn't log out.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'setup' | 'done'

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.phone) {
          setUser(parsed);
          setIsLoggedIn(true);
          setAuthStep('done');
        }
      }
    } catch { /* ignore */ }
  }, []);

  // "Send" OTP (stub — just advances step)
  const sendOtp = useCallback((phone) => {
    // Phase 0 stub: accept any valid-looking Indian phone number
    if (!phone || phone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit phone number' };
    }
    setUser(prev => ({ ...prev, phone }));
    setAuthStep('otp');
    return { success: true };
  }, []);

  // Verify OTP (stub — accepts any 4 digits)
  const verifyOtp = useCallback((code) => {
    // Phase 0 stub: accept any 4-digit code
    if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
      return { success: false, error: 'Please enter a 4-digit code' };
    }

    // Check if user already exists (returning user)
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setUser(parsed);
          setIsLoggedIn(true);
          setAuthStep('done');
          return { success: true, isReturning: true };
        }
      }
    } catch { /* ignore */ }

    setAuthStep('setup');
    return { success: true, isReturning: false };
  }, []);

  // Complete first-time setup
  const completeSetup = useCallback((name, locality) => {
    if (!name?.trim()) {
      return { success: false, error: 'Please enter your name' };
    }
    if (!locality) {
      return { success: false, error: 'Please select your locality' };
    }
    const fullUser = { ...user, name: name.trim(), locality };
    setUser(fullUser);
    setIsLoggedIn(true);
    setAuthStep('done');
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUser));
    return { success: true };
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setAuthStep('phone');
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return {
    user,
    isLoggedIn,
    authStep,
    setAuthStep,
    sendOtp,
    verifyOtp,
    completeSetup,
    logout,
  };
}
