import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../hooks/useReports';
import StatusBadge from '../components/ui/StatusBadge';
import { SkeletonMap } from '../components/ui/Skeleton';
import { WASTE_TYPE_OPTIONS, STATUS_OPTIONS } from '../data/mockReports';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create colored circle markers based on report intensity
function createIntensityIcon(reportCount) {
  let color, size, borderColor;
  if (reportCount >= 8) {
    color = '#f25628'; size = 28; borderColor = '#d9431a';
  } else if (reportCount >= 4) {
    color = '#f0851e'; size = 22; borderColor = '#d4710f';
  } else {
    color = '#fab328'; size = 16; borderColor = '#e09a10';
  }

  return L.divIcon({
    className: 'custom-intensity-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 50%;
      border: 3px solid ${borderColor};
      box-shadow: 0 2px 8px ${color}55, 0 0 0 3px ${color}22;
      transition: transform 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

// User location blue dot
const userIcon = L.divIcon({
  className: 'user-location-dot',
  html: `<div style="
    width: 16px; height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.25), 0 2px 4px rgba(0,0,0,0.15);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Map controller for setting initial view
function MapSetup() {
  const map = useMap();
  useEffect(() => {
    map.setView([12.9141, 74.8560], 11);
  }, [map]);
  return null;
}

/**
 * MapPage — Full-screen Leaflet map showing plastic waste reports.
 * Marker color/size indicates report density (heat-map feel).
 * Filter bar overlay for waste type and status filtering.
 */
export default function MapPage() {
  const { filteredReports, loading, filters, setFilters } = useReports();
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Try to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}, // Silently fail — don't block the map
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  // Memoize markers
  const markers = useMemo(() =>
    filteredReports.map(report => ({
      ...report,
      icon: createIntensityIcon(report.reportCount),
    })),
    [filteredReports]
  );

  if (loading) {
    return <SkeletonMap className="fixed inset-0 md:top-16" />;
  }

  return (
    <div className="fixed inset-0 md:top-16 z-0">
      {/* Filter bar overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2">
        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="self-start bg-surface/95 glass px-3.5 py-2 rounded-xl shadow-elevated
            text-xs font-semibold text-muted flex items-center gap-2 press-scale
            border border-border hover:border-primary/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filter
          {(filters.wasteType !== 'All' || filters.status !== 'All') && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </button>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="bg-surface/95 glass rounded-xl shadow-elevated border border-border p-3 animate-slide-down space-y-3">
            {/* Waste type pills */}
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-1.5">Waste Type</p>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...WASTE_TYPE_OPTIONS].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilters(f => ({ ...f, wasteType: type }))}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all press-scale
                      ${filters.wasteType === type
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-border-light text-muted hover:bg-border'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Status pills */}
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-1.5">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...STATUS_OPTIONS].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilters(f => ({ ...f, status }))}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all press-scale
                      ${filters.status === status
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-border-light text-muted hover:bg-border'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(filters.wasteType !== 'All' || filters.status !== 'All') && (
              <button
                onClick={() => setFilters({ wasteType: 'All', status: 'All' })}
                className="text-xs font-semibold text-orange-red hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Report count badge */}
      <div className="absolute bottom-22 md:bottom-6 left-3 z-[1000]">
        <div className="bg-surface/95 glass px-3 py-1.5 rounded-full shadow-elevated border border-border text-xs font-semibold text-muted">
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-22 md:bottom-6 right-3 z-[1000]">
        <div className="bg-surface/95 glass px-3 py-2 rounded-xl shadow-elevated border border-border space-y-1">
          <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Density</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow border-2 border-yellow" />
              <span className="text-[10px] text-muted">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#f0851e] border-2 border-[#d4710f]" />
              <span className="text-[10px] text-muted">Mid</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full bg-orange-red border-2 border-[#d9431a]" />
              <span className="text-[10px] text-muted">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[12.9141, 74.8560]}
        zoom={11}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapSetup />

        {/* User location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}

        {/* Report markers */}
        {markers.map(report => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={report.icon}
          >
            <Popup>
              <div className="min-w-[180px]">
                {/* Photo thumbnail */}
                <img
                  src={report.photoUrl}
                  alt={report.wasteType}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <p className="font-bold text-sm text-black mb-0.5">{report.placeName}</p>
                <p className="text-xs text-[#6b7280] mb-2">{report.wasteType}</p>

                <div className="flex items-center justify-between mb-1.5">
                  <StatusBadge status={report.status} />
                  <span className="text-[10px] font-semibold text-[#9ca3af]">
                    {report.reportCount} report{report.reportCount !== 1 ? 's' : ''}
                  </span>
                </div>

                <p className="text-[10px] text-[#9ca3af]">
                  First reported {report.daysSinceFirst} day{report.daysSinceFirst !== 1 ? 's' : ''} ago
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
