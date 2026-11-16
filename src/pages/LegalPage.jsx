import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '../components/ui/Icons';

/**
 * LegalPage — Privacy Policy (/privacy) and Terms of Service (/terms)
 * with clearly marked placeholder text.
 */
export default function LegalPage({ docType = 'privacy' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isPrivacy = docType === 'privacy';

  const paragraphs = isPrivacy
    ? [t('legal_privacy_p1'), t('legal_privacy_p2'), t('legal_privacy_p3')]
    : [t('legal_terms_p1'), t('legal_terms_p2'), t('legal_terms_p3')];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="touch-target -ml-2 px-2 text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>{t('legal_back_to_profile')}</span>
      </button>

      <section className="border border-border rounded-[8px] bg-white p-6 space-y-4">
        <span className="inline-block px-2.5 py-1 rounded-[4px] bg-yellow-light border border-yellow/40 text-[11px] font-bold text-yellow-dark">
          {t('legal_placeholder_badge')}
        </span>

        <h1 className="text-xl font-bold text-black tracking-tight">
          {isPrivacy ? t('legal_privacy_heading') : t('legal_terms_heading')}
        </h1>

        <div className="space-y-3 text-xs text-muted leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

