import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import AuthProvider from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import AppShell from './components/layout/AppShell';
import OnboardingScreen from './components/onboarding/OnboardingScreen';
import RequireAuth from './components/auth/RequireAuth';
import { BrandMark } from './components/ui/Icons';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import PickupPage from './pages/PickupPage';
import RewardsPage from './pages/RewardsPage';
import LearnPage from './pages/LearnPage';
import PlasticTypesPage from './pages/PlasticTypesPage';
import BusinessPage from './pages/BusinessPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import LegalPage from './pages/LegalPage';

/**
 * Swachha Parisara — Citizen App V2 (mock data)
 * Plastic Waste Reporting & Recycling for Dakshina Kannada
 *
 * Routes:
 *   /          → landing redirect: logged-in → /home, guest → /map
 *   /auth      → Sign up / Log in (after onboarding, or from the login gate)
 *   /map       → Map (public, guests can use it and the Report flow)
 *   /report    → Report (public, launched from the Map "+ Report" button)
 *   /home      → Home            (members only)
 *   /pickup    → Pickup          (members only)
 *   /rewards   → Rewards         (members only)
 *   /profile   → Profile         (members only)
 *   /learn     → Learn & Segregate (public, not a tab)
 *   /business  → Business Collaboration (not a tab)
 */

/** Landing redirect based on the session. */
function Landing() {
  const { isLoggedIn } = useAuth();
  return <Navigate to={isLoggedIn ? '/home' : '/map'} replace />;
}

/** Shown for a moment while the saved session / onboarding flag are read. */
function BootSplash() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-white" role="status" aria-live="polite">
      <BrandMark className="size-12 rounded-2xl animate-pulse" />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const { isLoggedIn, authLoading } = useAuth();
  const { seen, loading: onboardingLoading, complete } = useOnboarding();

  if (authLoading || onboardingLoading) {
    return <BootSplash />;
  }

  // First launch only: onboarding, then the Auth screen for guests
  if (!seen) {
    return (
      <OnboardingScreen
        onFinish={async () => {
          await complete();
          navigate(isLoggedIn ? '/home' : '/auth', { replace: true });
        }}
      />
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Public */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/plastic-types" element={<PlasticTypesPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/privacy" element={<LegalPage docType="privacy" />} />
        <Route path="/terms" element={<LegalPage docType="terms" />} />

        {/* Members only: guests see the "Log in to use this" gate at the same URL */}
        <Route path="/home" element={<RequireAuth featureKey="home"><HomePage /></RequireAuth>} />
        <Route path="/pickup" element={<RequireAuth featureKey="pickup"><PickupPage /></RequireAuth>} />
        <Route path="/rewards" element={<RequireAuth featureKey="rewards"><RewardsPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth featureKey="profile"><ProfilePage /></RequireAuth>} />

        <Route path="*" element={<Landing />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}
