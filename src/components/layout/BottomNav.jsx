import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Map',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#38761d' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    path: '/report',
    label: 'Report',
    isAction: true,
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#38761d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
  },
  {
    path: '/pickup',
    label: 'Pickup',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#38761d' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    path: '/learn',
    label: 'Learn',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#38761d' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
];

/**
 * Responsive navigation component:
 * - Mobile: Fixed bottom tab bar (thumb-reachable)
 * - Desktop (≥768px): Top header navigation bar
 * Single component, responsive styling — no duplicated logic.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* === DESKTOP NAV (≥768px) — shown as top bar === */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-surface/95 glass border-b border-border h-16 items-center px-6 gap-1">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mr-auto press-scale"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">♻</span>
          </div>
          <span className="text-lg font-bold text-primary tracking-tight">Swaccha Parisara</span>
        </button>

        {/* Nav items */}
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all duration-200 press-scale touch-target
                ${isActive
                  ? (item.isAction ? 'bg-primary text-white shadow-fab' : 'bg-primary-light text-primary')
                  : 'text-muted hover:bg-border-light hover:text-black'
                }
              `}
            >
              {item.icon(isActive)}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* === MOBILE NAV (<768px) — fixed bottom tab bar === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 glass border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-end justify-around h-16 px-2">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;

            // Report tab gets special treatment — raised action button
            if (item.isAction) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex flex-col items-center justify-center -mt-4 press-scale touch-target
                    ${isActive ? '' : ''}
                  `}
                  aria-label={item.label}
                >
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center shadow-fab
                    transition-all duration-200
                    ${isActive ? 'bg-primary-dark scale-110' : 'bg-primary'}
                  `}>
                    {item.icon(true)}
                  </div>
                  <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-primary' : 'text-muted'}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 touch-target press-scale"
                aria-label={item.label}
              >
                {item.icon(isActive)}
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-light'}`}>
                  {item.label}
                </span>
                {/* Active dot indicator */}
                <div className={`w-1 h-1 rounded-full transition-all duration-200 ${isActive ? 'bg-primary scale-100' : 'scale-0'}`} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
