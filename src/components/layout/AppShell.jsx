import React, { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import OfflineBanner from '../ui/OfflineBanner';
import AskChatSheet from '../chat/AskChatSheet';
import { ShellActionsContext } from './shellContext';
import { cn } from '../../utils/cn';

/**
 * AppShell — Clean Mobile-First Layout Wrapper (no global TopBar).
 * - Home starts directly with the user greeting, points badge, and notification bell.
 * - Non-Home routes render their own contextual `PageTopBar` (`← Title`).
 * - Ask assistant & Language selection live inside Profile/Settings.
 */
export default function AppShell({ children }) {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';
  const isAuthPage = location.pathname === '/auth';
  const [askOpen, setAskOpen] = useState(false);

  const openAsk = useCallback(() => setAskOpen(true), []);
  const closeAsk = useCallback(() => setAskOpen(false), []);
  const shellActions = useMemo(() => ({ openAsk, closeAsk }), [openAsk, closeAsk]);

  return (
    <ShellActionsContext.Provider value={shellActions}>
      <div className="flex flex-col min-h-dvh w-full max-w-full overflow-x-hidden bg-cream text-ink">
        <OfflineBanner />

        <main
          className={cn(
            'flex-1 relative w-full min-w-0 max-w-full',
            isMapPage
              ? ''
              : isAuthPage
                ? 'pb-10'
                : 'pb-24'
          )}
        >
          <div key={location.pathname} className="page-enter w-full min-w-0 max-w-full">
            {children}
          </div>
        </main>

        <BottomNav />

        <AskChatSheet open={askOpen} onClose={closeAsk} />
      </div>
    </ShellActionsContext.Provider>
  );
}
