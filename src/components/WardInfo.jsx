import React from 'react';
import { useApp } from '../lib/AppContext';

export default function WardInfo() {
  const { currentWard, currentPoliticians, locationLoading, locationError, getUserLocation } = useApp();

  if (locationLoading) {
    return (
      <div className="loading-container" aria-label="Detecting location">
        <div className="spinner" />
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Detecting your location…</p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="fallback-location">
        <p>We couldn't access your location automatically.</p>
        <button className="fallback-btn" onClick={getUserLocation}>
          📍 Use Current Location
        </button>
      </div>
    );
  }

  if (!currentWard) return null;

  return (
    <div className="ward-section">
      <div className="ward-info-card">
        {/* Header with icon */}
        <div className="ward-info-header">
          <div className="ward-info-icon">📍</div>
          <div>
            <h2>{currentWard.ward_name}</h2>
            <span className="ward-sub">Ward No. {currentWard.ward_no}</span>
          </div>
        </div>

        {/* Politicians section */}
        {currentPoliticians && (
          <div className="ward-politicians">
            <div className="politician-badge">
              <span className="role">MLA</span>
              <a 
                href={`https://wa.me/?text=I want to contact MLA ${currentPoliticians.mla_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="politician-link name"
              >
                {currentPoliticians.mla_name}
              </a>
              {currentPoliticians.mla_party && (
                <span className="party-tag">{currentPoliticians.mla_party}</span>
              )}
            </div>
            <div className="politician-badge">
              <span className="role">MP</span>
              <a 
                href={`https://wa.me/?text=I want to contact MP ${currentPoliticians.mp_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="politician-link name"
              >
                {currentPoliticians.mp_name}
              </a>
              {currentPoliticians.mp_party && (
                <span className="party-tag">{currentPoliticians.mp_party}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}