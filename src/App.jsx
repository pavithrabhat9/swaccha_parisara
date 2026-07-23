import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import AppShell from './components/layout/AppShell';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import PickupPage from './pages/PickupPage';
import LearnPage from './pages/LearnPage';
import BusinessPage from './pages/BusinessPage';

/**
 * Swachha Parisara — Phase 0 PWA
 * Plastic Waste Reporting & Recycling for Dakshina Kannada
 *
 * Routes:
 *   /          → Map (default, public)
 *   /report    → Report (anonymous)
 *   /pickup    → Home Pickup (login required)
 *   /learn     → Learn & Segregate (public)
 *   /business  → Business Collaboration (via link)
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
          <Route path="/business" element={<BusinessPage />} />
        </Routes>
      </AppShell>
    </ToastProvider>
  );
}