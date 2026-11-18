import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import OfflineBanner from '../ui/OfflineBanner';
import AskChatSheet from '../chat/AskChatSheet';

/**
 * App shell layout wrapper.
 * Handles: OfflineBanner + scrollable content area + BottomNav + AskChatSheet.
 * Uses min-w-0 and max-w-full so horizontal carousels inside pages never expand the viewport width.
 */
export default function AppShell({ children }) {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';
  const isAuthPage = location.pathname === '/auth';
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen min-h-dvh w-full max-w-full overflow-x-hidden bg-cream text-ink">
      {/* Persistent Offline Banner */}
      <OfflineBanner />

      {/* Main content area */}
      <main
        className={`
          flex-1 relative w-full min-w-0 max-w-full
          ${isMapPage
            ? 'md:pt-16'
            : isAuthPage
                ? 'pb-10 md:pt-16'
                : 'pb-28 md:pb-10 md:pt-16'
          }
        `}
      >
      <div key={location.pathname} className="page-enter w-full min-w-0 max-w-full">
        {children}
      </div>
    </main>

  {/* Responsive 5-tab navigation (Home, Map, Pickup, Rewards, Profile) */ }
  <BottomNav />

    {/* Ask Chatbot Sheet / Side Panel */ }
    < AskChatSheet open = { askOpen } onClose = {() => setAskOpen(false)
} />
    </div >
  );
}
