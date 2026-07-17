import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Geofence from './components/Geofence';
import { AppProvider, useApp } from './lib/AppContext';
import MapView from './components/MapView';
import ListView from './components/ListView';
import ReportModal from './components/ReportModal';
import StatusFilterDropdown from './components/StatusFilterDropdown';
import './styles/globals.css';

function AppContent() {
  const { showReportModal, setShowReportModal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isMapActive = location.pathname === '/';

  return (
    <div className="app-container">
      {/* Fixed Header — logo left, Map|List + filter dropdown right */}
      <header className="app-header" style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <span className="header-logo">{t('appTitle')}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button onClick={() => changeLanguage('en')}>{t('english')}</button>
          <button onClick={() => changeLanguage('kn')}>{t('kannada')}</button>
          <button
            className={`header-toggle-btn ${isMapActive ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            {t('mapView')}
          </button>
          <button
            className={`header-toggle-btn ${!isMapActive ? 'active' : ''}`}
            onClick={() => navigate('/list')}
          >
            {t('listView')}
          </button>
          <StatusFilterDropdown />
        </div>
      </header>

      {/* Content area — React Router handles view switching */}
      <div className="content-offset">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/list" element={<ListView />} />
          </Routes>
        </div>
      </div>

      {/* FAB - Report Button */}
      <button
        className="fab"
        onClick={() => setShowReportModal(true)}
        title={t('reportGarbage')}
        aria-label={t('reportGarbage')}
      >
        {t('reportGarbage')}
      </button>

      {/* Report Modal — kept as overlay, no route */}
      <ReportModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Geofence>
        <AppContent />
      </Geofence>
    </AppProvider>
  );
}