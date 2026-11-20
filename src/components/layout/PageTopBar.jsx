import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '../ui/Icons';

/**
 * PageTopBar — Reusable settings-style top bar:
 * - Left: Back arrow button (44px tap target). Goes to `onBack` if provided, otherwise history back or /home.
 * - Center: Page title.
 * - Right: Empty spacer so the title stays optically centered.
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
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-border px-3 sm:px-6 flex items-center justify-between">
      <button
        type="button"
        onClick={handleBack}
        aria-label={t('profile_back_aria')}
        className="size-11 rounded-full text-ink hover:bg-sunken flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeftIcon className="size-5" />
      </button>

      <h1 className="text-base font-extrabold text-ink text-balance truncate px-2">
        {title}
      </h1>

      <span className="size-11 shrink-0" aria-hidden="true" />
    </header>
  );
}
