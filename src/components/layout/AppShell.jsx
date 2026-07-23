import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

/**
 * App shell layout wrapper.
 * Handles: TopBar + scrollable content area + BottomNav.
 * Manages padding offsets for fixed navigation elements.
 */
export default function AppShell({ children }) {
  const location = useLocation();
  const isMapPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen min-h-dvh bg-cream">
      {/* Top bar (mobile only, hidden on map page) */}
      <TopBar />

      {/* Main content area */}
      <main
        className={`
          flex-1 relative
          ${isMapPage
            ? 'md:pt-16'  /* Map page: full screen on mobile, offset for desktop nav */
            : 'pb-20 md:pb-0 md:pt-16'  /* Other pages: offset for bottom nav (mobile) + top nav (desktop) */
          }
        `}
      >
        <div key={location.pathname} className="page-enter">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
