import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getSafeReturnPath } from '../utils/authUtils';
import PageTopBar from '../components/layout/PageTopBar';
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

  const handleSkip = async () => {
    await authHook.skipAuth();
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-[calc(100dvh-2.5rem)] flex flex-col">
      <PageTopBar
        title={t('auth_title')}
        rightSlot={
          <button
            type="button"
            onClick={handleSkip}
            aria-label={t('auth_skip_aria')}
            className="touch-target min-h-11 px-3 -mr-1.5 rounded-xl text-sm font-semibold text-muted hover:text-ink hover:bg-sunken transition-colors duration-150 cursor-pointer"
          >
            {t('auth_skip')}
          </button>
        }
      />
      <div className="flex-1 flex items-center justify-center w-full max-w-sm mx-auto px-4 py-6">
        <div className="w-full">
          <LoginFlow authHook={authHook} />
        </div>
      </div>
    </div>
  );
}
