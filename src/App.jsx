import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import AppShell from './components/layout/AppShell';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import PickupPage from './pages/PickupPage';
import LearnPage from './pages/LearnPage';
import BusinessPage from './pages/BusinessPage';
import ProfilePage from './pages/ProfilePage';

/**
 * Swachha Parisara — Phase 0 PWA
 * Plastic Waste Reporting & Recycling for Dakshina Kannada
 *
 * Routes:
 *   /          → Map (default, public)
 *   /report    → Report (anonymous, launched via "+ Report" button on Map)
 *   /pickup    → Home Pickup (rewards & collection)
 *   /learn     → Learn & Segregate (public)
 *   /profile   → Profile & Account (new 4th tab)
 *   /business  → Business Collaboration (reachable from Learn & Profile)
 */
export default function App() {
  return (
    <ToastProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/pickup" element={<PickupPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/business" element={<BusinessPage />} />
        </Routes>
      </AppShell>
    </ToastProvider>
  );
}
