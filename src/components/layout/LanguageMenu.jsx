import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from '../ui/Icons';
import { cn } from '../../utils/cn';

const LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English', disabled: false },
  { code: 'kn', short: 'ಕನ್ನಡ', name: 'ಕನ್ನಡ (Kannada)', disabled: false },
  { code: 'tcy', short: 'Tulu', name: 'Tulu', disabled: true },
  { code: 'kok', short: 'Konkani', name: 'Konkani', disabled: true },
  { code: 'bea', short: 'Beary', name: 'Beary', disabled: true },
];

export default function LanguageMenu() {
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
        className="touch-target h-9 px-3 rounded-xl bg-sunken hover:bg-border/70 text-ink text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer press-scale"
      >
        <GlobeIcon className="size-3.5 text-primary" />
        <span>{current.code === 'kn' ? 'ಕನ್ನಡ' : 'EN'}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-elevated py-1.5 min-w-[180px] z-50 animate-slide-down"
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
                className={cn(
                  'w-full min-h-10 px-4 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors duration-150',
                  lang.disabled
                    ? 'text-muted-light/60 cursor-not-allowed'
                    : active
                      ? 'text-primary-dark bg-primary-lighter cursor-pointer'
                      : 'text-ink hover:bg-sunken/70 cursor-pointer'
                )}
              >
                <span>{lang.name}</span>
                {active && !lang.disabled ? (
                  <svg className="size-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
