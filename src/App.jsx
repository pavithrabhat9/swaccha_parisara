import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import AuthProvider from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import AppShell from './components/layout/AppShell';
import OnboardingScreen from './components/onboarding/OnboardingScreen';
import RequireAuth from './components/auth/RequireAuth';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { BrandMark } from './components/ui/Icons';
import { ROUTES } from './routes/routeConfig';

// Lazy-loaded route chunks for React 19 + React Router v7 production scaling
const HomePage = lazy(() => import('./pages/HomePage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const PickupPage = lazy(() => import('./pages/PickupPage'));
const RewardsPage = lazy(() => import('./pages/RewardsPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const PlasticTypesPage = lazy(() => import('./pages/PlasticTypesPage'));
const BusinessPage = lazy(() => import('./pages/BusinessPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));

/** Landing redirect based on the session. */
function Landing() {
  const { isLoggedIn } = useAuth();
  return <Navigate to={isLoggedIn ? ROUTES.HOME : ROUTES.MAP} replace />;
}

/** Shown for a moment while the saved session / onboarding flag or route chunk loads. */
function BootSplash() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream" role="status" aria-live="polite">
      <BrandMark className="size-12 rounded-xl animate-pulse" />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-[60dvh] flex items-center justify-center" role="status" aria-live="polite">
      <BrandMark className="size-10 rounded-xl animate-pulse" />
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
          navigate(isLoggedIn ? ROUTES.HOME : ROUTES.AUTH, { replace: true });
        }}
      />
    );
  }

  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={ROUTES.ROOT} element={<Landing />} />
            <Route path={ROUTES.AUTH} element={<AuthPage />} />

            {/* Public routes */}
            <Route path={ROUTES.MAP} element={<MapPage />} />
            <Route path={ROUTES.REPORT} element={<ReportPage />} />
            <Route path={ROUTES.LEARN} element={<LearnPage />} />
            <Route path={ROUTES.PLASTIC_TYPES} element={<PlasticTypesPage />} />
            <Route path={ROUTES.BUSINESS} element={<BusinessPage />} />
            <Route path={ROUTES.PRIVACY} element={<LegalPage docType="privacy" />} />
            <Route path={ROUTES.TERMS} element={<LegalPage docType="terms" />} />

            {/* Members-only routes: guests see the "Log in to use this" gate at the same URL */}
            <Route path={ROUTES.HOME} element={<RequireAuth featureKey="home"><HomePage /></RequireAuth>} />
            <Route path={ROUTES.PICKUP} element={<RequireAuth featureKey="pickup"><PickupPage /></RequireAuth>} />
            <Route path={ROUTES.REWARDS} element={<RequireAuth featureKey="rewards"><RewardsPage /></RequireAuth>} />
            <Route path={ROUTES.PROFILE} element={<RequireAuth featureKey="profile"><ProfilePage /></RequireAuth>} />

            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
