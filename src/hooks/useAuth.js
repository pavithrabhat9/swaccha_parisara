import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/authApi';

/**
 * Lightweight phone auth stub for Phase 0.
 * Accepts any 4-digit OTP (demo mode — the "correct" code is always 1234, shown to user).
 * Session persists in localStorage so refreshing doesn't log out.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'setup' | 'done'

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const storedUser = await authApi.getUser();
      if (mounted) {
        if (storedUser) {
          setUser(storedUser);
          if (storedUser.phone) {
            setIsLoggedIn(true);
            setAuthStep('done');
          }
        }
      }
    };
    init();
    return () => { mounted = false; };
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
  const verifyOtp = useCallback(async (code) => {
    // Phase 0 stub: accept any 4-digit code
    if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
      return { success: false, error: 'Please enter a 4-digit code' };
    }

    // We check the API asynchronously
    const storedUser = await authApi.getUser();
    if (storedUser && storedUser.name) {
      setUser(storedUser);
      setIsLoggedIn(true);
      setAuthStep('done');
      return { success: true, isReturning: true };
    }

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
    authApi.saveUser(fullUser);
    return { success: true };
  }, [user]);

  // Update existing profile (from Profile page)
  const updateProfile = useCallback(async (updates) => {
    const trimmedName = updates?.name?.trim();
    const cleanedPhone = String(updates?.phone || user?.phone || '').replace(/\D/g, '').slice(0, 10);
    const nextLocality = updates?.locality || user?.locality;

    if (!trimmedName) {
      return { success: false, error: 'Please enter your name' };
    }
    if (cleanedPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit phone number' };
    }
    if (!nextLocality) {
      return { success: false, error: 'Please select your locality' };
    }

    const updatedUser = {
      ...user,
      name: trimmedName,
      phone: cleanedPhone,
      locality: nextLocality,
    };
    setUser(updatedUser);
    await authApi.saveUser(updatedUser);
    return { success: true, user: updatedUser };
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setAuthStep('phone');
    authApi.removeUser();
  }, []);

  return {
    user,
    isLoggedIn,
    authStep,
    setAuthStep,
    sendOtp,
    verifyOtp,
    completeSetup,
    updateProfile,
    logout,
  };
}
