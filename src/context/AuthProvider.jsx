import React from 'react';
import { AuthContext } from './authContext';
import { useAuthState } from '../hooks/useAuthState';

/**
 * Provides one shared auth session to the whole app (header, nav, gates and pages).
 */
export default function AuthProvider({ children }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

