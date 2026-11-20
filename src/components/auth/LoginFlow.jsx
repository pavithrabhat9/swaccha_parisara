import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DK_LOCALITIES } from '../../data/mockPickups';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import ErrorState from '../ui/ErrorState';
import { cn } from '../../utils/cn';

const LABEL_CLASS = 'block text-xs font-semibold text-ink mb-1.5';
const INPUT_CLASS =
  'w-full min-h-11 px-3.5 py-2.5 border border-border rounded-xl text-sm font-medium ' +
  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-sunken focus:bg-white text-ink placeholder:text-muted-light';
const PRIMARY_BUTTON =
  'w-full min-h-11 py-3 bg-primary text-white font-semibold rounded-xl text-sm ' +
  'hover:bg-primary-dark transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

const ACCOUNT_TYPES = [
  { id: 'individual', labelKey: 'auth_account_individual' },
  { id: 'business', labelKey: 'auth_account_business' },
];

/** Sign-up details: name, locality and account type. Mounted only on the setup step. */
function SetupStep({ user, onSubmit }) {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [locality, setLocality] = useState('');
  const [accountType, setAccountType] = useState('individual');

  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor="auth-name" className={LABEL_CLASS}>{t('yourName')}</label>
        <input
          id="auth-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t('auth_name_placeholder')}
          autoComplete="name"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="auth-locality" className={LABEL_CLASS}>{t('locality')}</label>
        <select
          id="auth-locality"
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

      <div>
        <span className={LABEL_CLASS}>{t('auth_account_type')}</span>
        <div role="radiogroup" aria-label={t('auth_account_type')} className="grid grid-cols-2 gap-2">
          {ACCOUNT_TYPES.map(type => {
            const selected = accountType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setAccountType(type.id)}
                className={cn(
                  'min-h-11 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-colors duration-150 cursor-pointer',
                  selected
                    ? 'border-primary text-primary-dark bg-primary-lighter'
                    : 'border-border bg-white text-ink hover:border-primary/40'
                )}
              >
                {t(type.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSubmit(name, locality, accountType)}
        disabled={!name.trim() || !locality}
        className={PRIMARY_BUTTON}
      >
        {t('startRecycling')}
      </button>
    </div>
  );
}

/**
 * Phone + OTP + sign-up flow (mock). Steps: phone (or Google) -> OTP -> sign-up details.
 */
export default function LoginFlow({ authHook }) {
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const { authStep, user, sendOtp, verifyOtp, signInWithGoogle, completeSetup, setAuthStep } = authHook;

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handlePhoneBlur = () => {
    setPhoneError(phone.length > 0 && phone.length < 10 ? t('auth_valid_phone_error') : '');
  };

  const handleSendOtp = () => {
    setPhoneError('');
    setError('');
    const result = sendOtp(phone);
    if (!result.success) setError(result.error);
  };

  const handleVerifyOtp = async () => {
    setError('');
    setBusy(true);
    const result = await verifyOtp(otp);
    setBusy(false);
    if (!result.success) setError(result.error);
  };

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    const result = await signInWithGoogle();
    setBusy(false);
    if (!result.success) setError(result.error);
  };

  const handleSetup = (name, locality, accountType) => {
    setError('');
    const result = completeSetup(name, locality, accountType);
    if (!result.success) setError(result.error);
  };

  const heading = {
    phone: t('auth_title'),
    otp: t('verifyNumber'),
    setup: t('almostThere'),
  }[authStep];

  const subheading = {
    phone: t('enterPhone'),
    otp: t('auth_otp_sent_to', { phone: user?.phone || '' }),
    setup: t('setupDescription'),
  }[authStep];

  return (
    <div className="flex flex-col items-center px-5 py-7 max-w-sm w-full mx-auto bg-white rounded-2xl border border-border">
      {/* Brand icon container */}
      <div className="size-12 rounded-2xl border border-primary/20 bg-primary-lighter flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38761d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-ink text-balance mb-1 text-center">{heading}</h1>
      <p className="text-sm text-muted text-pretty text-center mb-6">{subheading}</p>

      {/* Offline notice: sign-up / log-in need a connection */}
      {!isOnline && (
        <div
          role="status"
          className="w-full mb-4 border border-yellow/40 bg-yellow-light rounded-xl px-3.5 py-2.5 text-xs font-medium text-ink text-pretty"
        >
          {t('auth_offline_notice')}
        </div>
      )}

      {/* === PHONE STEP === */}
      {authStep === 'phone' && (
        <div className="w-full space-y-4">
          <div>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={!isOnline || busy}
              className="w-full min-h-11 py-3 px-4 bg-white text-ink font-semibold rounded-xl text-sm border border-border hover:border-primary/40 hover:bg-primary-lighter transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2.5"
            >
              <span
                aria-hidden="true"
                className="size-5 rounded-full border border-border bg-sunken flex items-center justify-center text-[11px] font-bold text-primary"
              >
                G
              </span>
              <span>{busy ? t('auth_signing_in') : t('auth_google')}</span>
            </button>
            <p className="mt-1.5 text-[11px] text-muted text-pretty text-center">{t('auth_google_stub_note')}</p>
          </div>

          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-semibold text-muted uppercase">{t('auth_or')}</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <div>
            <label htmlFor="auth-phone" className={LABEL_CLASS}>{t('phoneNumber')}</label>
            <div className="flex">
              <span className="flex items-center px-3.5 bg-border-light rounded-l-xl border border-r-0 border-border text-sm font-semibold text-muted tabular">
                +91
              </span>
              <input
                id="auth-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                aria-invalid={Boolean(phoneError) || undefined}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onBlur={handlePhoneBlur}
                placeholder={t('auth_phone_placeholder')}
                maxLength={10}
                className={cn(INPUT_CLASS, 'rounded-l-none tabular')}
              />
            </div>
            {phoneError && (
              <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{phoneError}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={phone.length < 10 || !isOnline}
            className={PRIMARY_BUTTON}
          >
            {t('sendOtp')}
          </button>
        </div>
      )}

      {/* === OTP STEP === */}
      {authStep === 'otp' && (
        <div className="w-full space-y-4">
          <div>
            <label htmlFor="auth-otp" className={LABEL_CLASS}>{t('verificationCode')}</label>
            <input
              id="auth-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={t('auth_otp_placeholder')}
              maxLength={4}
              className={cn(INPUT_CLASS, 'text-center text-xl font-bold tabular placeholder:text-sm')}
            />
          </div>

          <div className="border border-border bg-sunken rounded-xl px-3.5 py-2.5 text-xs text-center text-pretty">
            <span className="font-semibold text-ink">{t('auth_demo_mode')}</span>{' '}
            <span className="text-muted">{t('auth_demo_otp_hint')}</span>
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otp.length < 4 || busy || !isOnline}
            className={PRIMARY_BUTTON}
          >
            {busy ? t('auth_verifying') : t('verify')}
          </button>

          <button
            type="button"
            onClick={() => { setOtp(''); setError(''); setAuthStep('phone'); }}
            className="w-full min-h-11 text-sm font-semibold text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            {t('auth_change_number')}
          </button>
        </div>
      )}

      {/* === SIGN-UP DETAILS STEP === */}
      {authStep === 'setup' && <SetupStep user={user} onSubmit={handleSetup} />}

      {/* Recoverable error state */}
      {error && (
        <div className="w-full mt-4">
          <ErrorState
            title={t('auth_authentication_error')}
            description={t(error)}
            onRetry={() => setError('')}
          />
        </div>
      )}
    </div>
  );
}
