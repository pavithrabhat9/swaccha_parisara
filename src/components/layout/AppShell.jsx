import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import OfflineBanner from '../ui/OfflineBanner';

/**
 * App shell layout wrapper.
 * Handles: OfflineBanner + TopBar (mobile) + scrollable content area + BottomNav.
 * Uses min-w-0 and max-w-full so horizontal carousels inside pages never expand the viewport width.
 */
export default function AppShell({ children }) {
  const location = useLocation();
  const isMapPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen min-h-dvh w-full max-w-full overflow-x-hidden bg-cream text-ink">
      {/* Persistent Offline Banner */}
      <OfflineBanner />

      {/* Mobile brand header */}
      <TopBar />

      {/* Main content area */}
      <main
        className={`
          flex-1 relative w-full min-w-0 max-w-full
          ${isMapPage
            ? 'md:pt-16'
            : 'pb-24 md:pb-10 md:pt-16'
          }
        `}
      >
        <div key={location.pathname} className="page-enter w-full min-w-0 max-w-full">
          {children}
        </div>
      </main>

      {/* Responsive navigation (floating bottom bar on mobile, top bar on desktop) */}
      <BottomNav />
    </div>
  );
}
