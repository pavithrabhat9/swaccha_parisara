import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from '../ui/Icons';

const LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English', disabled: false },
  { code: 'kn', short: 'ಕನ್ನಡ', name: 'ಕನ್ನಡ (Kannada)', disabled: false },
  { code: 'tcy', short: 'Tulu', name: 'Tulu', disabled: true },
  { code: 'kok', short: 'Konkani', name: 'Konkani', disabled: true },
  { code: 'bea', short: 'Beary', name: 'Beary', disabled: true },
];

export default function LanguageMenu({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const handleSelect = (lang) => {
    if (lang.disabled) return;
    i18n.changeLanguage(lang.code);
    localStorage.setItem('i18nextLng', lang.code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(prev => !prev);
        }}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`
          touch-target inline-flex items-center justify-center gap-1.5 rounded-lg
          text-white font-semibold hover:bg-white/15 transition-colors cursor-pointer
          ${compact ? 'h-9 px-2.5 text-caption' : 'h-10 px-3 text-caption'}
        `}
      >
        <GlobeIcon className="w-4 h-4 text-white" />
        <span className="text-white">{current.code === 'kn' ? 'ಕನ್ನಡ' : 'EN'}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-elevated py-1.5 min-w-[176px] z-50 animate-slide-down"
        >
          {LANGUAGES.map(lang => {
            const active = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={active}
                disabled={lang.disabled}
                onClick={() => handleSelect(lang)}
                className={`
                  w-full px-3.5 py-2 text-left text-caption font-semibold flex items-center justify-between
                  transition-colors
                  ${lang.disabled
                    ? 'text-muted-light/60 cursor-not-allowed'
                    : active
                      ? 'text-primary-dark bg-primary-light/70 cursor-pointer'
                      : 'text-ink hover:bg-sunken cursor-pointer'
                  }
                `}
              >
                <span>{lang.name}</span>
                {lang.disabled ? (
                  <span className="text-[10px] font-medium text-muted-light">Soon</span>
                ) : active ? (
                  <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

