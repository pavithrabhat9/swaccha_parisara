import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PAGE_TITLES = {
  '/': 'Waste Map',
  '/report': 'Report Plastic Waste',
  '/pickup': 'Home Pickup',
  '/learn': 'Learn & Segregate',
  '/business': 'Business Pickup',
};

const LANGUAGES = [
  { code: 'en', name: 'English', disabled: false },
  { code: 'kn', name: 'ಕನ್ನಡ', fullName: 'Kannada', disabled: false },
  { code: 'tcy', name: 'Tulu', disabled: true },
  { code: 'kok', name: 'Konkani', disabled: true },
  { code: 'bea', name: 'Beary', disabled: true },
];

/**
 * Mobile top bar — shows app name and page context.
 * Hidden on desktop where the header nav includes the logo.
 */
export default function TopBar() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const pageTitle = PAGE_TITLES[location.pathname] || 'Swachha Parisara';
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowLangMenu(false);
    if (showLangMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLangMenu]);

  const handleLanguageChange = (lang) => {
    if (lang.disabled) return;
    i18n.changeLanguage(lang.code);
    localStorage.setItem('i18nextLng', lang.code);
    setShowLangMenu(false);
  };

  return (
    <header className="md:hidden sticky top-0 z-40 bg-surface/95 glass border-b border-border px-4 flex items-center gap-3"
      style={{ minHeight: '52px' }}
    >
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-primary tracking-tight truncate">
          Swachha Parisara
        </h1>
        <p className="text-[11px] font-medium text-muted -mt-0.5 truncate">
          {pageTitle}
        </p>
      </div>
      {/* Language selector */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowLangMenu(!showLangMenu);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-muted hover:bg-border-light transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          {currentLang.code === 'en' ? 'EN' : 'KN'}
        </button>
        {showLangMenu && (
          <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-md shadow-elevated py-2 min-w-[140px] z-50">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                disabled={lang.disabled}
                className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between
                  ${lang.disabled 
                    ? 'text-muted-light cursor-not-allowed' 
                    : i18n.language === lang.code 
                      ? 'text-primary bg-primary-light' 
                      : 'text-muted hover:bg-border-light'
                  }`}
              >
                <span>{lang.name}</span>
                
                {i18n.language === lang.code && !lang.disabled && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}