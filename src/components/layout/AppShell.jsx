import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import OfflineBanner from '../ui/OfflineBanner';
import AskChatSheet from '../chat/AskChatSheet';
import { cn } from '../../utils/cn';

/**
 * AppShell — Civic Utility Layout Wrapper.
 * Renders OfflineBanner, persistent TopBar (with desktop nav, Ask assistant, and language switch),
 * main content area, mobile flat BottomNav dock, and AskChatSheet.
 */
export default function AppShell({ children }) {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';
  const isAuthPage = location.pathname === '/auth';
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-dvh w-full max-w-full overflow-x-hidden bg-cream text-ink">
      <OfflineBanner />

      <TopBar onOpenAsk={() => setAskOpen(true)} />

      <main
        className={cn(
          'flex-1 relative w-full min-w-0 max-w-full',
          isMapPage
            ? ''
            : isAuthPage
              ? 'pb-10'
              : 'pb-20 md:pb-12'
        )}
      >
        <div key={location.pathname} className="page-enter w-full min-w-0 max-w-full">
          {children}
        </div>
      </main>

      <BottomNav />

      <AskChatSheet open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
