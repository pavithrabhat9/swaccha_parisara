import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, LockIcon } from '../ui/Icons';

/**
 * LoginGate — Warm consumer access prompt for members-only tabs.
 */
export default function LoginGate({ featureKey }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const benefits = [t('gate_benefit_1'), t('gate_benefit_2'), t('gate_benefit_3')];

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 md:py-12">
      <section className="rounded-2xl card-elevated overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3.5">
            <div className="size-11 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
              <LockIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold text-ink tracking-tight text-balance">{t('gate_title')}</h1>
              <p className="text-xs text-muted text-pretty mt-1 leading-relaxed">
                {featureKey ? `${t(featureKey)} — ${t('gate_subtitle')}` : t('gate_subtitle')}
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 bg-sunken/60 rounded-xl p-4">
            {benefits.map(benefit => (
              <li key={benefit} className="flex items-start gap-2.5 text-xs font-medium text-ink text-pretty">
                <CheckCircleIcon className="size-4 text-primary shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/auth', { state: { from: location.pathname } })}
              className="w-full min-h-12 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-[0_6px_18px_-3px_rgba(13,122,87,0.38)] hover:bg-primary-dark transition-all duration-150 cursor-pointer press-scale"
            >
              {t('gate_login_button')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/map')}
              className="w-full min-h-10 rounded-xl text-xs font-bold text-muted hover:text-ink hover:bg-sunken transition-colors duration-150 cursor-pointer"
            >
              {t('auth_explore_map')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
