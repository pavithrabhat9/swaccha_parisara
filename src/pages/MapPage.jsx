import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../hooks/useReports';
import StatusBadge from '../components/ui/StatusBadge';
import CountUp from '../components/ui/CountUp';
import { SkeletonMap } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { MapPinIcon, ClockIcon } from '../components/ui/Icons';
import { WASTE_TYPE_OPTIONS, STATUS_OPTIONS } from '../data/mockReports';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Create palette-strict severity markers with embedded count and green selection ring.
 * Palette only: #fab328 (low), #f68428 (mid mix), #f25628 (high), #38761d (cleared/active ring).
 */
function createIntensityIcon(reportCount, status, isSelected) {
  const isCleared = status === 'Cleared';
  let bg;
  let textColor;
  let size;
  let ringColor;

  if (isCleared) {
    bg = '#38761d';
    textColor = '#ffffff';
    size = 30;
    ringColor = 'rgba(56, 118, 29, 0.25)';
  } else if (reportCount >= 8) {
    bg = '#f25628';
    textColor = '#ffffff';
    size = 36;
    ringColor = 'rgba(242, 86, 40, 0.30)';
  } else if (reportCount >= 4) {
    bg = '#f68428';
    textColor = '#ffffff';
    size = 31;
    ringColor = 'rgba(246, 132, 40, 0.26)';
  } else {
    bg = '#fab328';
    textColor = '#000000';
    size = 26;
    ringColor = 'rgba(250, 179, 40, 0.28)';
  }

  const scale = isSelected ? 1.18 : 1;
  const border = isSelected ? '3px solid #38761d' : '2.5px solid #ffffff';
  const halo = isSelected
    ? '0 0 0 6px rgba(56, 118, 29, 0.35), 0 8px 20px rgba(0, 0, 0, 0.22)'
    : `0 0 0 5px ${ringColor}, 0 4px 12px rgba(0, 0, 0, 0.18)`;

  return L.divIcon({
    className: 'custom-intensity-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      color: ${textColor};
      border-radius: 9999px;
      border: ${border};
      box-shadow: ${halo};
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Inter, system-ui, sans-serif;
      font-size: ${reportCount >= 8 ? 12 : 11}px;
      font-weight: 800;
      letter-spacing: -0.02em;
      transform: scale(${scale});
      transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.2s ease;
    ">${reportCount}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// User location dot — strictly in brand palette (#38761d + white border)
const userIcon = L.divIcon({
  className: 'user-location-dot',
  html: `<div style="
    width: 16px;
    height: 16px;
    background: #38761d;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 0 0 5px rgba(56, 118, 29, 0.25), 0 2px 6px rgba(0, 0, 0, 0.2);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Map setup, size invalidation on resize/mount, & click-to-dismiss handler
function MapController({ onDismiss }) {
  const map = useMap();
  useEffect(() => {
    map.setView([12.9141, 74.8560], 11);
    const id = setTimeout(() => map.invalidateSize(), 60);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);

  useMapEvents({
    click() {
      onDismiss?.();
    },
  });

  return null;
}

/**
 * MapPage — Full-bleed Leaflet map showing plastic waste reports across Dakshina Kannada.
 * Responsive layout for both mobile (<768px) and desktop (≥768px):
 * - Top bar over map: Filter button on left + compact impact badge on mobile right
 * - Bottom over map: Impact counter (left on desktop) + Density legend (right)
 * - Selected marker opens a bottom sheet on mobile / floating card on desktop
 */
export default function MapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reports, filteredReports, loading, filters, setFilters } = useReports();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Try to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  // Currently selected report (if still present in filtered list)
  const selectedReport = useMemo(
    () => filteredReports?.find(r => r.id === selectedReportId) || null,
    [filteredReports, selectedReportId]
  );

  // Memoize markers with selection state
  const markers = useMemo(
    () =>
      (filteredReports || []).map(report => ({
        ...report,
        icon: createIntensityIcon(report.reportCount, report.status, report.id === selectedReportId),
      })),
    [filteredReports, selectedReportId]
  );

  // Collective impact metrics
  const impactStats = useMemo(() => {
    const list = filteredReports || [];
    const cleared = list.filter(r => r.status === 'Cleared').length;
    const totalVolumeReports = (reports || []).reduce((sum, r) => sum + (r.reportCount || 1), 0);
    return {
      spots: list.length,
      cleared,
      totalVolumeReports,
    };
  }, [filteredReports, reports]);

  const activeFilterCount =
    (filters.wasteType !== 'All' ? 1 : 0) + (filters.status !== 'All' ? 1 : 0);

  if (loading) {
    return <SkeletonMap className="fixed inset-x-0 top-[52px] md:top-16 bottom-16 md:bottom-0 z-0" />;
  }

  if (!filteredReports) {
    return (
      <div className="fixed inset-x-0 top-[52px] md:top-16 bottom-16 md:bottom-0 z-0 flex items-center justify-center p-4">
        <ErrorState
          title={t('map_unavailable_title')}
          description={t('map_unavailable_description')}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-[52px] md:top-16 bottom-16 md:bottom-0 z-0 overflow-hidden select-none">
      {/* === TOP FLOATING BAR === */}
      <div className="absolute top-3 md:top-4 left-3 right-3 md:left-6 md:right-auto md:w-84 z-[900] flex flex-col gap-2 pointer-events-none">
        {/* Top row: Filter button + active filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowFilters(prev => !prev)}
            aria-expanded={showFilters}
            className={`
              h-10 px-3.5 rounded-2xl shadow-elevated text-caption font-bold
              inline-flex items-center gap-2 press-scale transition-all cursor-pointer border
              ${showFilters || activeFilterCount > 0
                ? 'bg-primary text-white border-primary shadow-pill'
                : 'bg-white/95 glass text-black border-border hover:border-primary/40'
              }
            `}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span>{t('filter')}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-primary text-[11px] font-extrabold inline-flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter summary tags (1-tap clear) */}
          {filters.wasteType !== 'All' && (
            <button
              type="button"
              onClick={() => setFilters(f => ({ ...f, wasteType: 'All' }))}
              className="h-8 px-3 rounded-full bg-primary text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-pill press-scale cursor-pointer"
            >
              <span className="truncate max-w-[120px]">{filters.wasteType}</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
          {filters.status !== 'All' && (
            <button
              type="button"
              onClick={() => setFilters(f => ({ ...f, status: 'All' }))}
              className="h-8 px-3 rounded-full bg-primary text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-pill press-scale cursor-pointer"
            >
              <span>{filters.status}</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        {/* Expanded filter card — wraps cleanly on both mobile and desktop */}
        {showFilters && (
          <div className="pointer-events-auto bg-white/98 glass rounded-2xl shadow-elevated border border-border p-3.5 animate-slide-down space-y-3.5 max-h-[60vh] overflow-y-auto">
            {/* Waste type section */}
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                {t('map_filter_waste_type')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...WASTE_TYPE_OPTIONS].map(type => {
                  const active = filters.wasteType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilters(f => ({ ...f, wasteType: type }))}
                      className={`
                        px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all press-scale cursor-pointer border
                        ${active
                          ? 'bg-primary text-white border-primary shadow-pill'
                          : 'bg-sunken text-black border-border hover:border-primary/40 hover:text-primary'
                        }
                      `}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status section */}
            <div className="pt-2.5 border-t border-border-light">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                {t('map_filter_status')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...STATUS_OPTIONS].map(status => {
                  const active = filters.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilters(f => ({ ...f, status }))}
                      className={`
                        px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all press-scale cursor-pointer border
                        ${active
                          ? 'bg-primary text-white border-primary shadow-pill'
                          : 'bg-sunken text-black border-border hover:border-primary/40 hover:text-primary'
                        }
                      `}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer actions */}
            {activeFilterCount > 0 && (
              <div className="pt-2 border-t border-border-light flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFilters({ wasteType: 'All', status: 'All' })}
                  className="text-caption font-semibold text-orange-red hover:underline cursor-pointer"
                >
                  {t('clearFilters')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-semibold shadow-xs press-scale cursor-pointer"
                >
                  {filteredReports.length} {t('reports')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* === EMPTY STATE OVERLAY (when 0 markers match) === */}
      {markers.length === 0 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-[850] max-w-sm mx-auto">
          <EmptyState
            title={t('map_no_reports_title')}
            description={t('map_no_reports_description')}
            actionLabel={t('map_report_plastic_waste')}
            onAction={() => navigate('/report')}
            className="bg-white/95 glass shadow-elevated"
          />
        </div>
      )}

      {/* === BOTTOM BAR: COLLECTIVE IMPACT (bottom-left) + DENSITY LEGEND (bottom-right) ===
          Responsive compact sizing on mobile so both fit side-by-side cleanly on 360px+ phones */}
      <div
        className={`
          absolute left-3 right-3 md:left-6 md:right-6 bottom-3 md:bottom-6 z-[850]
          flex items-end justify-between gap-2 pointer-events-none
          transition-opacity duration-200
          ${selectedReport ? 'opacity-0 md:opacity-100' : 'opacity-100'}
        `}
      >
        {/* Collective Impact Pill */}
        <div className="pointer-events-auto bg-white/95 glass rounded-2xl shadow-elevated border border-border px-3 py-2 md:px-3.5 md:py-2.5 flex items-center gap-2.5 min-w-0">
          <span className="hidden sm:flex w-8 h-8 rounded-xl bg-primary-light items-center justify-center text-primary shrink-0" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </span>
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1 text-[11px] md:text-caption font-extrabold text-black whitespace-nowrap">
              <CountUp value={impactStats.spots} duration={700} />
              <span>{t('reports')}</span>
              <span className="text-muted-light" aria-hidden="true">·</span>
              <span className="text-primary">
                <CountUp value={impactStats.cleared} duration={700} /> {t('impact_spots_cleared')}
              </span>
            </div>
            <p className="hidden sm:block text-[11px] font-medium text-muted mt-0.5">
              <CountUp value={impactStats.totalVolumeReports} duration={900} /> {t('impact_community_reports')}
            </p>
          </div>
        </div>

        {/* Severity / Density Legend */}
        <div className="pointer-events-auto bg-white/95 glass px-2.5 py-2 md:px-3.5 md:py-2.5 rounded-2xl shadow-elevated border border-border shrink-0">
          <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-1">{t('density')}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-severity-low ring-2 ring-severity-low/30" />
              <span className="text-[10px] font-semibold text-black">{t('low')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-severity-mid ring-2 ring-severity-mid/30" />
              <span className="text-[10px] font-semibold text-black">{t('mid')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-severity-high ring-2 ring-severity-high/30" />
              <span className="text-[10px] font-semibold text-black">{t('high')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === SELECTED PIN BOTTOM SHEET (Mobile) / FLOATING DETAIL CARD (Desktop) ===
          No close 'X' button per user requirement — dismiss by tapping the map or handle bar */}
      {selectedReport && (
        <div
          role="dialog"
          aria-label={selectedReport.placeName}
          className="
            absolute inset-x-3 bottom-3 md:inset-x-auto md:right-6 md:bottom-6 md:w-96
            z-[950] bg-white rounded-3xl shadow-modal border border-border
            p-4 animate-slide-up
          "
        >
          {/* Drag/tap handle bar (tap to dismiss) */}
          <button
            type="button"
            onClick={() => setSelectedReportId(null)}
            aria-label={t('map')}
            className="w-full flex justify-center pb-2.5 cursor-pointer"
          >
            <span className="w-10 h-1.5 rounded-full bg-border" />
          </button>

          {/* Padded image + core details */}
          <div className="flex gap-3.5 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-sunken border border-border/60 shrink-0">
              <img
                src={selectedReport.photoUrl}
                alt={selectedReport.wasteType}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span
                className={`
                  absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold tabular shadow-xs
                  ${selectedReport.reportCount >= 8
                    ? 'bg-orange-red text-white'
                    : selectedReport.reportCount >= 4
                      ? 'bg-severity-mid text-white'
                      : 'bg-yellow text-black'
                  }
                `}
              >
                {selectedReport.reportCount} {t('reports')}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <StatusBadge status={selectedReport.status} />
              </div>

              <h3 className="text-body sm:text-heading font-bold text-black truncate mt-1">
                {selectedReport.placeName}
              </h3>

              <p className="text-caption font-semibold text-primary mt-0.5">
                {selectedReport.wasteType}
              </p>

              <div className="flex items-center gap-1.5 text-caption text-muted mt-2">
                <ClockIcon className="w-3.5 h-3.5 text-muted-light shrink-0" />
                <span>
                  {t('firstReported')} {selectedReport.daysSinceFirst} {t('daysAgo')}
                </span>
              </div>
            </div>
          </div>

          {selectedReport.note && (
            <p className="mt-3 pt-3 border-t border-border-light text-caption text-muted line-clamp-2 leading-relaxed">
              {selectedReport.note}
            </p>
          )}

          {/* Footer metadata strip */}
          <div className="mt-3 pt-2.5 border-t border-border-light flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted">
              <MapPinIcon className="w-3.5 h-3.5 text-primary" />
              {selectedReport.lat.toFixed(3)}, {selectedReport.lng.toFixed(3)}
            </span>
            <button
              type="button"
              onClick={() => navigate('/report')}
              className="text-caption font-bold text-primary hover:text-primary-dark press-scale cursor-pointer"
            >
              + {t('map_report_plastic_waste')} →
            </button>
          </div>
        </div>
      )}

      {/* === LEAFLET MAP === */}
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

        <MapController onDismiss={() => { setSelectedReportId(null); setShowFilters(false); }} />

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
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                setShowFilters(false);
                setSelectedReportId(report.id);
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
