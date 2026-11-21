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
import { MapPinIcon, ClockIcon, PlusIcon } from '../components/ui/Icons';
import { WASTE_TYPE_OPTIONS, STATUS_OPTIONS } from '../data/mockReports';
import { cn } from '../utils/cn';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Tactile circular map pins in the Sunlit Coastal palette:
 * #0d7a57 (Cleared), #e05232 (High 8+), #f97316 (Mid 4-7), #f59e0b (Low 1-3).
 */
function createIntensityIcon(reportCount, status, isSelected) {
  const isCleared = status === 'Cleared';
  let bg;
  let size;

  if (isCleared) {
    bg = '#0d7a57';
    size = 32;
  } else if (reportCount >= 8) {
    bg = '#e05232';
    size = 38;
  } else if (reportCount >= 4) {
    bg = '#f97316';
    size = 34;
  } else {
    bg = '#f59e0b';
    size = 30;
  }

  const scale = isSelected ? 1.18 : 1;
  const border = isSelected ? '3px solid #101916' : '2.5px solid #ffffff';
  const shadow = isSelected
    ? '0 0 0 5px rgba(13, 122, 87, 0.28), 0 8px 20px rgba(16, 25, 22, 0.28)'
    : '0 4px 12px rgba(16, 25, 22, 0.24)';

  return L.divIcon({
    className: 'custom-intensity-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      color: #ffffff;
      border-radius: 9999px;
      border: ${border};
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif;
      font-variant-numeric: tabular-nums;
      font-size: ${reportCount >= 8 ? 13 : 12}px;
      font-weight: 800;
      transform: scale(${scale});
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    ">${reportCount}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const userIcon = L.divIcon({
  className: 'user-location-dot',
  html: `<div style="
    width: 16px;
    height: 16px;
    background: #0d7a57;
    border-radius: 9999px;
    border: 3px solid #ffffff;
    box-shadow: 0 0 0 5px rgba(13, 122, 87, 0.24), 0 3px 8px rgba(16, 25, 22, 0.22);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

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
 * MapPage — Dakshina Kannada Civic Waste Survey Map.
 */
export default function MapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reports, filteredReports, loading, filters, setFilters } = useReports();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  const selectedReport = useMemo(
    () => filteredReports?.find(r => r.id === selectedReportId) || null,
    [filteredReports, selectedReportId]
  );

  const markers = useMemo(
    () =>
      (filteredReports || []).map(report => ({
        ...report,
        icon: createIntensityIcon(report.reportCount, report.status, report.id === selectedReportId),
      })),
    [filteredReports, selectedReportId]
  );

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
    return <SkeletonMap className="fixed inset-x-0 top-14 bottom-15 md:bottom-0 z-0" />;
  }

  if (!filteredReports) {
    return (
      <div className="fixed inset-x-0 top-14 bottom-15 md:bottom-0 z-0 flex items-center justify-center p-4 bg-cream">
        <ErrorState
          title={t('map_unavailable_title')}
          description={t('map_unavailable_description')}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-15 bottom-16 md:bottom-0 z-0 overflow-hidden select-none">
      {/* === TOP FLOATING FILTER HUD === */}
      <div className="absolute top-3 md:top-4 left-3 right-3 md:left-5 md:right-auto md:w-84 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowFilters(prev => !prev)}
            aria-expanded={showFilters}
            className={cn(
              'min-h-10 px-4 rounded-xl shadow-elevated text-xs font-bold',
              'inline-flex items-center gap-2 press-scale transition-colors duration-150 cursor-pointer',
              showFilters || activeFilterCount > 0
                ? 'bg-primary text-white'
                : 'bg-white/95 glass text-ink hover:bg-white'
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span>{t('filter')}</span>
            {activeFilterCount > 0 && (
              <span className="size-5 rounded-full bg-white text-primary tabular text-[11px] font-extrabold inline-flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {filters.wasteType !== 'All' && (
            <button
              type="button"
              onClick={() => setFilters(f => ({ ...f, wasteType: 'All' }))}
              aria-label={`Clear ${filters.wasteType} filter`}
              className="min-h-9 px-3 rounded-lg bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 press-scale cursor-pointer"
            >
              <span className="truncate max-w-[120px]">{filters.wasteType}</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
          {filters.status !== 'All' && (
            <button
              type="button"
              onClick={() => setFilters(f => ({ ...f, status: 'All' }))}
              aria-label={`Clear ${filters.status} filter`}
              className="min-h-9 px-3 rounded-lg bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 press-scale cursor-pointer"
            >
              <span>{filters.status}</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="pointer-events-auto bg-white/98 glass rounded-xl shadow-elevated border border-border p-4 animate-slide-down space-y-3.5 max-h-[58dvh] overflow-y-auto">
            <div>
              <p className="text-xs font-bold text-ink mb-2">
                {t('map_filter_waste_type')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...WASTE_TYPE_OPTIONS].map(type => {
                  const active = filters.wasteType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilters(f => ({ ...f, wasteType: type }))}
                      className={cn(
                        'min-h-9 px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 press-scale cursor-pointer border',
                        active
                          ? 'bg-primary text-white border-primary'
                          : 'bg-sunken text-ink border-border hover:border-primary/40 hover:text-primary'
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-border-light">
              <p className="text-xs font-bold text-ink mb-2">
                {t('map_filter_status')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...STATUS_OPTIONS].map(status => {
                  const active = filters.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilters(f => ({ ...f, status }))}
                      className={cn(
                        'min-h-9 px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 press-scale cursor-pointer border',
                        active
                          ? 'bg-primary text-white border-primary'
                          : 'bg-sunken text-ink border-border hover:border-primary/40 hover:text-primary'
                      )}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="pt-2.5 border-t border-border-light flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFilters({ wasteType: 'All', status: 'All' })}
                  className="min-h-9 px-2 text-xs font-semibold text-orange-red-dark hover:underline cursor-pointer"
                >
                  {t('clearFilters')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="min-h-9 px-3.5 py-1 rounded-lg bg-primary text-white font-mono-data text-xs font-semibold press-scale cursor-pointer"
                >
                  {filteredReports.length} {t('reports')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* === EMPTY STATE OVERLAY === */}
      {markers.length === 0 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-10 max-w-sm mx-auto">
          <EmptyState
            title={t('map_no_reports_title')}
            description={t('map_no_reports_description')}
            actionLabel={t('map_report_plastic_waste')}
            onAction={() => navigate('/report')}
            className="bg-white/95 glass shadow-elevated"
          />
        </div>
      )}

      {/* === BOTTOM CARTOGRAPHIC TELEMETRY & LEGEND BAR === */}
      <div
        className={cn(
          'absolute left-3 right-3 md:left-5 md:right-5 bottom-4 md:bottom-5 z-10',
          'flex items-end justify-between gap-2 pointer-events-none',
          'transition-opacity duration-150',
          selectedReport ? 'opacity-0 md:opacity-100' : 'opacity-100'
        )}
      >
        {/* District Impact Summary */}
        <div className="pointer-events-auto bg-white/95 glass rounded-2xl shadow-elevated px-4 py-3 min-w-0">
          <div className="flex items-center gap-1.5 tabular text-xs font-extrabold text-ink whitespace-nowrap">
            <CountUp value={impactStats.spots} duration={700} />
            <span className="font-semibold text-muted">{t('reports')}</span>
            <span className="text-border" aria-hidden="true">·</span>
            <span className="text-primary">
              <CountUp value={impactStats.cleared} duration={700} /> {t('impact_spots_cleared')}
            </span>
          </div>
          <p className="hidden sm:block tabular text-[11px] font-medium text-muted mt-0.5">
            <CountUp value={impactStats.totalVolumeReports} duration={900} /> {t('impact_community_reports')}
          </p>
        </div>

        {/* Right stack: Report Action + Density Legend */}
        <div className="flex flex-col items-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/report')}
            aria-label={t('map_report_plastic_waste')}
            className="pointer-events-auto touch-target h-12 px-5 rounded-2xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-fab inline-flex items-center justify-center gap-1.5 press-scale transition-colors duration-150 cursor-pointer"
          >
            <PlusIcon className="size-4" />
            <span>{t('map_fab_report').replace(/^\+\s*/, '')}</span>
          </button>

          <div className="pointer-events-auto bg-white/95 glass px-3.5 py-2 rounded-xl shadow-elevated shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-muted">{t('density')}</span>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-severity-low" />
                <span className="text-[11px] font-semibold text-ink">{t('low')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-severity-mid" />
                <span className="text-[11px] font-semibold text-ink">{t('mid')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-severity-high" />
                <span className="text-[11px] font-semibold text-ink">{t('high')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === SELECTED SITE INSPECTOR CARD === */}
      {selectedReport && (
        <div
          role="dialog"
          aria-label={selectedReport.placeName}
          className="
            absolute inset-x-3 bottom-4 md:inset-x-auto md:right-5 md:bottom-5 md:w-96
            z-30 bg-white rounded-2xl shadow-modal
            p-4 animate-slide-up
          "
        >
          <button
            type="button"
            onClick={() => setSelectedReportId(null)}
            aria-label={t('map')}
            className="w-full flex justify-center pb-2.5 cursor-pointer"
          >
            <span className="w-10 h-1 rounded-full bg-border" />
          </button>

          <div className="flex gap-3.5 items-start">
            <div className="relative size-24 rounded-lg overflow-hidden bg-sunken border border-border shrink-0">
              <img
                src={selectedReport.photoUrl}
                alt={selectedReport.wasteType}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span
                className={cn(
                  'absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded font-mono-data text-[10px] font-bold text-white',
                  selectedReport.reportCount >= 8
                    ? 'bg-orange-red'
                    : selectedReport.reportCount >= 4
                      ? 'bg-severity-mid'
                      : 'bg-severity-low'
                )}
              >
                {selectedReport.reportCount}×
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <StatusBadge status={selectedReport.status} />

              <h3 className="text-sm sm:text-base font-bold text-ink text-balance truncate mt-1.5">
                {selectedReport.placeName}
              </h3>

              <p className="text-xs font-semibold text-primary mt-0.5">
                {selectedReport.wasteType}
              </p>

              <div className="flex items-center gap-1.5 font-mono-data text-[11px] text-muted mt-2">
                <ClockIcon className="size-3.5 text-muted-light shrink-0" />
                <span>
                  {t('firstReported')} {selectedReport.daysSinceFirst} {t('daysAgo')}
                </span>
              </div>
            </div>
          </div>

          {selectedReport.note && (
            <p className="mt-3 pt-3 border-t border-border-light text-xs text-muted text-pretty line-clamp-2 leading-relaxed">
              {selectedReport.note}
            </p>
          )}

          <div className="mt-3 pt-2.5 border-t border-border-light flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 font-mono-data text-[11px] font-medium text-muted">
              <MapPinIcon className="size-3.5 text-primary" />
              {selectedReport.lat.toFixed(3)}, {selectedReport.lng.toFixed(3)}
            </span>
            <button
              type="button"
              onClick={() => navigate('/report')}
              className="min-h-9 px-2.5 rounded-lg bg-primary-lighter text-xs font-semibold text-primary hover:bg-primary-light cursor-pointer"
            >
              + {t('map_report_plastic_waste')}
            </button>
          </div>
        </div>
      )}

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

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}

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
