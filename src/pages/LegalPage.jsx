import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageTopBar from '../components/layout/PageTopBar';

/**
 * LegalPage — Privacy Policy (/privacy) and Terms of Service (/terms).
 */
export default function LegalPage({ docType = 'privacy' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isPrivacy = docType === 'privacy';

  const title = isPrivacy ? t('profile_row_privacy_title') : t('profile_row_terms_title');
  const heading = isPrivacy ? t('legal_privacy_heading') : t('legal_terms_heading');
  const paragraphs = isPrivacy
    ? [t('legal_privacy_p1'), t('legal_privacy_p2'), t('legal_privacy_p3')]
    : [t('legal_terms_p1'), t('legal_terms_p2'), t('legal_terms_p3')];

  return (
    <div className="pb-12">
      <PageTopBar title={title} onBack={() => navigate('/profile')} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="rounded-xl bg-white border border-border p-6 space-y-4">
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-yellow-light border border-yellow/40 font-mono-data text-[11px] font-semibold text-yellow-dark">
            {t('legal_placeholder_badge')}
          </span>

          <h2 className="text-lg font-bold text-ink text-balance">
            {heading}
          </h2>

          <div className="space-y-3 text-xs text-muted text-pretty leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
