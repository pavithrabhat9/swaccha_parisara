import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getSafeReturnPath } from '../utils/authUtils';
import LoginFlow from '../components/auth/LoginFlow';

/**
 * AuthPage — "Sign up / Log in" screen (route /auth).
 * Reached after onboarding or from the login gate. After a successful login the user is
 * sent back to the tab they originally tapped (location.state.from), otherwise to Home.
 */
export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const authHook = useAuth();

  if (authHook.isLoggedIn) {
    return <Navigate to={getSafeReturnPath(location.state?.from)} replace />;
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-4 md:py-8">
      <LoginFlow authHook={authHook} />
      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate('/map')}
          className="min-h-[44px] px-3 text-sm font-semibold text-primary hover:text-primary-dark hover:underline underline-offset-2 cursor-pointer"
        >
          {t('auth_explore_map')}
        </button>
      </div>
    </div>
  );
}

