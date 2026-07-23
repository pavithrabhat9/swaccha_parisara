import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/': 'Waste Map',
  '/report': 'Report Plastic Waste',
  '/pickup': 'Home Pickup',
  '/learn': 'Learn & Segregate',
  '/business': 'Business Pickup',
};

/**
 * Mobile top bar — shows app name and page context.
 * Hidden on desktop where the header nav includes the logo.
 */
export default function TopBar() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Swachha Parisara';

  // Hide on map page (map takes full screen)
  if (location.pathname === '/') return null;

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
    </header>
  );
}
