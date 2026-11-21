import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '../ui/Icons';

/**
 * PageTopBar — Sub-page contextual breadcrumb/header bar below the global utility header.
 */
export default function PageTopBar({ title, onBack }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="bg-white border-b border-border px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto h-12 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label={t('profile_back_aria')}
          className="size-9 -ml-1.5 rounded-lg text-ink hover:bg-sunken flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeftIcon className="size-4" />
        </button>

        <h1 className="text-sm font-bold text-ink text-balance truncate">
          {title}
        </h1>
      </div>
    </div>
  );
}
