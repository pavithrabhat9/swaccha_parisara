import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, LockIcon } from '../ui/Icons';

/**
 * "Log in to use this" screen shown in place of a members-only tab for guests.
 * The login button remembers the tapped tab so the user returns to it after logging in.
 */
export default function LoginGate({ featureKey }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const benefits = [t('gate_benefit_1'), t('gate_benefit_2'), t('gate_benefit_3')];

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 md:py-12">
      <section className="border border-border rounded-[8px] bg-white p-6 space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-[8px] border border-border bg-sunken flex items-center justify-center text-primary shrink-0">
            <LockIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            {featureKey && (
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                {t(featureKey)}
              </p>
            )}
            <h1 className="text-lg font-bold text-black tracking-tight">{t('gate_title')}</h1>
            <p className="text-xs text-muted mt-1">{t('gate_subtitle')}</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {benefits.map(benefit => (
            <li key={benefit} className="flex items-start gap-2.5 text-xs text-black">
              <CheckCircleIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate('/auth', { state: { from: location.pathname } })}
            className="w-full min-h-[44px] py-3 bg-primary text-white font-semibold rounded-[6px] text-sm hover:bg-primary-dark transition-colors cursor-pointer"
          >
            {t('gate_login_button')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="w-full min-h-[44px] text-sm font-semibold text-muted hover:text-black transition-colors cursor-pointer"
          >
            {t('auth_explore_map')}
          </button>
        </div>
      </section>
    </div>
  );
}

