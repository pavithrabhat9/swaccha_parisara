import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginGate from './LoginGate';

/**
 * Route guard: members-only screens render for logged-in users,
 * guests see the "Log in to use this" gate at the same URL (so the tapped tab stays active).
 */
export default function RequireAuth({ children, featureKey }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <LoginGate featureKey={featureKey} />;
}

