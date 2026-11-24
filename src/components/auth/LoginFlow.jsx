import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DK_LOCALITIES } from '../../data/mockPickups';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { BrandMark, ArrowLeftIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

const LABEL_CLASS = 'block text-xs font-semibold text-ink mb-1.5';
const INPUT_CLASS =
  'w-full min-h-11 px-3.5 py-2.5 border border-border rounded-xl text-sm font-medium ' +
  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white text-ink placeholder:text-muted-light transition-colors duration-150';
const PRIMARY_BUTTON =
  'w-full min-h-11 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm ' +
  'hover:bg-primary-dark transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

/** Official 4-color Google "G" mark (per Google Identity brand guidelines). */
function GoogleIcon({ className = 'size-5 shrink-0' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function EyeIcon({ open, className = 'size-4' }) {
  if (open) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(INPUT_CLASS, 'pr-11')}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? t('auth_hide_password') : t('auth_show_password')}
        className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted hover:text-ink transition-colors duration-150 cursor-pointer rounded-r-xl"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

function GoogleButton({ onClick, disabled, busy }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full min-h-11 py-2.5 px-4 bg-white text-ink font-semibold rounded-xl text-sm border border-border hover:bg-sunken transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2.5"
    >
      <GoogleIcon className="size-[18px] shrink-0" />
      <span>{busy ? t('auth_signing_in') : t('auth_google')}</span>
    </button>
  );
}

function OrDivider() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 my-5" aria-hidden="true">
      <span className="flex-1 h-px bg-border" />
      <span className="text-xs font-medium text-muted">{t('auth_or')}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

function GoogleSetupStep({ user, onSubmit, error }) {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [locality, setLocality] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, locality);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="auth-setup-name" className={LABEL_CLASS}>{t('yourName')}</label>
        <input
          id="auth-setup-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t('auth_name_placeholder')}
          autoComplete="name"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="auth-setup-locality" className={LABEL_CLASS}>{t('locality')}</label>
        <select
          id="auth-setup-locality"
          value={locality}
          onChange={e => setLocality(e.target.value)}
          className={cn(INPUT_CLASS, 'cursor-pointer')}
        >
          <option value="">{t('auth_select_locality')}</option>
          {DK_LOCALITIES.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-orange-red-dark bg-orange-red/10 border border-orange-red/20 rounded-xl px-3.5 py-2.5 text-pretty">
          {t(error)}
        </p>
      )}

      <button
        type="submit"
        disabled={!name.trim() || !locality}
        className={PRIMARY_BUTTON}
      >
        {t('auth_continue')}
      </button>
    </form>
  );
}

/**
 * LoginFlow — Clean, professional authentication card with separate Login, Sign up,
 * Forgot password, and official Google sign-in flows.
 */
export default function LoginFlow({ authHook }) {
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const {
    authStep,
    user,
    signInWithGoogle,
    loginWithCredentials,
    signUpWithCredentials,
    checkAccountExists,
    resetPassword,
    completeSetup,
  } = authHook;

  // 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupLocality, setSignupLocality] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState('find'); // 'find' | 'reset'
  const [forgotId, setForgotId] = useState('');
  const [verifiedResetId, setVerifiedResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const switchMode = (nextMode) => {
    setError('');
    setNotice('');
    if (nextMode === 'forgot') {
      setForgotStep('find');
      setForgotId(loginId);
      setNewPassword('');
      setConfirmPassword('');
    }
    setMode(nextMode);
  };

  const handleGoogle = async () => {
    setError('');
    setNotice('');
    setBusy(true);
    const result = await signInWithGoogle();
    setBusy(false);
    if (!result.success) setError(result.error);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    const result = await loginWithCredentials(loginId, loginPassword);
    setBusy(false);
    if (!result.success) setError(result.error);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    const result = await signUpWithCredentials({
      name: signupName,
      phone: signupPhone,
      email: signupEmail,
      locality: signupLocality,
      password: signupPassword,
    });
    setBusy(false);
    if (!result.success) setError(result.error);
  };

  const handleForgotFind = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const result = await checkAccountExists(forgotId);
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setVerifiedResetId(result.identifier);
    setForgotStep('reset');
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('auth_password_mismatch');
      return;
    }
    setBusy(true);
    const result = await resetPassword(verifiedResetId, newPassword);
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setLoginId(verifiedResetId);
    setLoginPassword('');
    setMode('login');
    setNotice('auth_reset_success');
  };

  const handleGoogleSetup = (name, locality) => {
    setError('');
    const result = completeSetup(name, locality);
    if (!result.success) setError(result.error);
  };

  const isGoogleSetup = authStep === 'setup';

  const heading = isGoogleSetup
    ? t('auth_google_setup_heading')
    : mode === 'signup'
      ? t('auth_signup_heading')
      : mode === 'forgot'
        ? t('auth_forgot_heading')
        : t('auth_login_heading');

  const subheading = isGoogleSetup
    ? t('auth_google_setup_subtitle')
    : mode === 'signup'
      ? t('auth_signup_subtitle')
      : mode === 'forgot'
        ? (forgotStep === 'reset' ? t('auth_forgot_new_subtitle') : t('auth_forgot_subtitle'))
        : t('auth_login_subtitle');

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border border-border shadow-sm px-6 py-7">
      {/* Header */}
      <div className="mb-6">
        {mode === 'forgot' && !isGoogleSetup ? (
          <button
            type="button"
            onClick={() => switchMode('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink mb-4 -ml-1 px-1 py-1 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>{t('auth_back_to_login')}</span>
          </button>
        ) : (
          <div className="mb-4">
            <BrandMark className="size-10 rounded-xl" />
          </div>
        )}
        <h1 className="text-xl font-bold text-ink text-balance leading-tight">{heading}</h1>
        <p className="text-sm text-muted text-pretty mt-1">{subheading}</p>
      </div>

      {!isOnline && (
        <div
          role="status"
          className="w-full mb-4 border border-yellow/40 bg-yellow-light rounded-xl px-3.5 py-2.5 text-xs font-medium text-ink text-pretty"
        >
          {t('auth_offline_notice')}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="w-full mb-4 border border-primary/25 bg-primary-light rounded-xl px-3.5 py-2.5 text-xs font-semibold text-primary-dark text-pretty"
        >
          {t(notice)}
        </div>
      )}

      {/* First-time Google setup */}
      {isGoogleSetup && (
        <GoogleSetupStep user={user} onSubmit={handleGoogleSetup} error={error} />
      )}

      {/* Login View */}
      {!isGoogleSetup && mode === 'login' && (
        <div>
          <GoogleButton onClick={handleGoogle} disabled={!isOnline || busy} busy={busy} />
          <OrDivider />

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-login-id" className={LABEL_CLASS}>
                {t('auth_identifier_label')}
              </label>
              <input
                id="auth-login-id"
                type="text"
                autoComplete="username"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                placeholder={t('auth_identifier_placeholder')}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-login-password" className="text-xs font-semibold text-ink">
                  {t('auth_password_label')}
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer"
                >
                  {t('auth_forgot_link')}
                </button>
              </div>
              <PasswordInput
                id="auth-login-password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder={t('auth_password_placeholder')}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-semibold text-orange-red-dark bg-orange-red/10 border border-orange-red/20 rounded-xl px-3.5 py-2.5 text-pretty">
                {t(error)}
              </p>
            )}

            <button
              type="submit"
              disabled={!loginId.trim() || !loginPassword || busy || !isOnline}
              className={PRIMARY_BUTTON}
            >
              {busy ? t('auth_signing_in') : t('auth_login_cta')}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            {t('auth_no_account')}{' '}
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer"
            >
              {t('auth_switch_signup')}
            </button>
          </p>
        </div>
      )}

      {/* Sign Up View */}
      {!isGoogleSetup && mode === 'signup' && (
        <div>
          <GoogleButton onClick={handleGoogle} disabled={!isOnline || busy} busy={busy} />
          <OrDivider />

          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="auth-signup-name" className={LABEL_CLASS}>{t('yourName')}</label>
              <input
                id="auth-signup-name"
                type="text"
                autoComplete="name"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                placeholder={t('auth_name_placeholder')}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="auth-signup-phone" className={LABEL_CLASS}>{t('phoneNumber')}</label>
              <div className="flex">
                <span className="flex items-center px-3 bg-sunken rounded-l-xl border border-r-0 border-border text-xs font-semibold text-muted tabular-nums">
                  +91
                </span>
                <input
                  id="auth-signup-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t('auth_phone_placeholder')}
                  maxLength={10}
                  className={cn(INPUT_CLASS, 'rounded-l-none tabular-nums')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-signup-email" className={LABEL_CLASS}>
                {t('auth_email_optional')}
              </label>
              <input
                id="auth-signup-email"
                type="email"
                autoComplete="email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                placeholder={t('auth_email_placeholder')}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="auth-signup-locality" className={LABEL_CLASS}>{t('locality')}</label>
              <select
                id="auth-signup-locality"
                value={signupLocality}
                onChange={e => setSignupLocality(e.target.value)}
                className={cn(INPUT_CLASS, 'cursor-pointer')}
              >
                <option value="">{t('auth_select_locality')}</option>
                {DK_LOCALITIES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="auth-signup-password" className={LABEL_CLASS}>
                {t('auth_password_label')}
              </label>
              <PasswordInput
                id="auth-signup-password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                placeholder={t('auth_new_password_placeholder')}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-semibold text-orange-red-dark bg-orange-red/10 border border-orange-red/20 rounded-xl px-3.5 py-2.5 text-pretty">
                {t(error)}
              </p>
            )}

            <button
              type="submit"
              disabled={!signupName.trim() || signupPhone.length < 10 || !signupLocality || signupPassword.length < 6 || busy || !isOnline}
              className={PRIMARY_BUTTON}
            >
              {busy ? t('auth_signing_in') : t('auth_signup_cta')}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            {t('auth_have_account')}{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer"
            >
              {t('auth_switch_login')}
            </button>
          </p>
        </div>
      )}

      {/* Forgot Password View */}
      {!isGoogleSetup && mode === 'forgot' && forgotStep === 'find' && (
        <form onSubmit={handleForgotFind} className="space-y-4">
          <div>
            <label htmlFor="auth-reset-id" className={LABEL_CLASS}>
              {t('auth_identifier_label')}
            </label>
            <input
              id="auth-reset-id"
              type="text"
              autoComplete="username"
              value={forgotId}
              onChange={e => setForgotId(e.target.value)}
              placeholder={t('auth_identifier_placeholder')}
              className={INPUT_CLASS}
            />
          </div>

          {error && (
            <p role="alert" className="text-xs font-semibold text-orange-red-dark bg-orange-red/10 border border-orange-red/20 rounded-xl px-3.5 py-2.5 text-pretty">
              {t(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={!forgotId.trim() || busy || !isOnline}
            className={PRIMARY_BUTTON}
          >
            {t('auth_continue')}
          </button>
        </form>
      )}

      {!isGoogleSetup && mode === 'forgot' && forgotStep === 'reset' && (
        <form onSubmit={handleForgotReset} className="space-y-4">
          <div>
            <label htmlFor="auth-reset-password" className={LABEL_CLASS}>
              {t('auth_new_password_label')}
            </label>
            <PasswordInput
              id="auth-reset-password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder={t('auth_new_password_placeholder')}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="auth-reset-confirm" className={LABEL_CLASS}>
              {t('auth_confirm_password_label')}
            </label>
            <PasswordInput
              id="auth-reset-confirm"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t('auth_confirm_password_placeholder')}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs font-semibold text-orange-red-dark bg-orange-red/10 border border-orange-red/20 rounded-xl px-3.5 py-2.5 text-pretty">
              {t(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={newPassword.length < 6 || !confirmPassword || busy || !isOnline}
            className={PRIMARY_BUTTON}
          >
            {t('auth_reset_cta')}
          </button>
        </form>
      )}
    </div>
  );
}
