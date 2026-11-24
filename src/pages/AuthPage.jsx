import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getSafeReturnPath } from '../utils/authUtils';
import LoginFlow from '../components/auth/LoginFlow';

/**
 * AuthPage — Clean, distraction-free Login / Sign up / Forgot Password screen (route /auth).
 * No redundant page title bar: only a minimal top-right Skip action and the centered auth card.
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
      <header
        className="w-full max-w-md mx-auto px-4 pt-3 flex items-center justify-end"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <button
          type="button"
          onClick={handleSkip}
          aria-label={t('auth_skip_aria')}
          className="touch-target min-h-11 px-3 -mr-1.5 rounded-xl text-sm font-semibold text-muted hover:text-ink hover:bg-sunken transition-colors duration-150 cursor-pointer"
        >
          {t('auth_skip')}
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto px-4 pb-6 pt-2">
        <div className="w-full">
          <LoginFlow authHook={authHook} />
        </div>
      </div>
    </div>
  );
}
