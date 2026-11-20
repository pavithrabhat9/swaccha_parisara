import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { dropPointApi } from '../../services/dropPointApi';
import { formatHoursSummary, getDirectionsUrl, sortByDistance } from '../../utils/dropPointUtils';
import { formatShortDate } from '../../utils/dateUtils';
import OpenStatusBadge from './OpenStatusBadge';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import { SkeletonCard } from '../ui/Skeleton';
import {
  MapPinIcon,
  ClockIcon,
  DirectionsIcon,
  QrIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
} from '../ui/Icons';

/**
 * TrashBankTab — List of sample drop-off centers, center detail view with mock QR,
 * and user drop-off history.
 */
export default function TrashBankTab({ initialCenterId = null }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [centers, setCenters] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCenterId, setSelectedCenterId] = useState(initialCenterId);
  const [showQr, setShowQr] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedCenters, loadedHistory] = await Promise.all([
        dropPointApi.getDropPoints(),
        dropPointApi.getDropOffHistory(),
      ]);
      setCenters(sortByDistance(loadedCenters));
      setHistory(loadedHistory);
    } catch (err) {
      setError(err?.message || 'Failed to load drop-off centers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const [loadedCenters, loadedHistory] = await Promise.all([
          dropPointApi.getDropPoints(),
          dropPointApi.getDropOffHistory(),
        ]);
        if (mounted) {
          setCenters(sortByDistance(loadedCenters));
          setHistory(loadedHistory);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load drop-off centers');
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('ui_error_default_title')}
        description={error}
        retryLabel={t('ui_error_try_again')}
        onRetry={loadData}
      />
    );
  }

  const selectedCenter = centers.find(c => c.id === selectedCenterId) || null;
  const memberCode = `SP-${(user?.phone || '987654').slice(-4)}-${(user?.locality || 'DK').slice(0, 3).toUpperCase()}`;

  return (
    <div className="space-y-6">
      {/* === CENTER DETAIL VIEW === */}
      {selectedCenter ? (
        <section className="border border-border rounded-2xl bg-white p-5 space-y-5">
          <button
            type="button"
            onClick={() => {
              setSelectedCenterId(null);
              setShowQr(false);
            }}
            className="touch-target -ml-2 px-2 text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5 cursor-pointer rounded-lg"
          >
            <ArrowLeftIcon className="size-4" />
            <span>{t('trash_bank_back_to_list')}</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink text-balance">{selectedCenter.name}</h2>
              <p className="text-xs text-muted inline-flex items-center gap-1.5 tabular">
                <MapPinIcon className="size-3.5 text-primary shrink-0" />
                <span>{selectedCenter.address}</span>
                <span aria-hidden="true">·</span>
                <span>{t('distance_km', { km: selectedCenter.distanceKm })}</span>
              </p>
            </div>
            <OpenStatusBadge point={selectedCenter} />
          </div>

          <div className="p-3.5 rounded-xl bg-sunken border border-border flex items-center gap-2.5 text-xs tabular">
            <ClockIcon className="size-4 text-primary shrink-0" />
            <div>
              <span className="font-semibold text-ink">{t('trash_bank_hours_label')}: </span>
              <span className="text-muted">{formatHoursSummary(selectedCenter)}</span>
            </div>
          </div>

          {/* Actions: Directions + Show My QR */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={getDirectionsUrl(selectedCenter)}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2.5 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary-lighter text-xs font-semibold text-ink inline-flex items-center gap-2 transition-colors duration-150"
            >
              <DirectionsIcon className="size-4 text-primary" />
              <span>{t('trash_bank_directions')}</span>
            </a>

            <button
              type="button"
              onClick={() => setShowQr(prev => !prev)}
              className="touch-target px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors duration-150 cursor-pointer"
            >
              <QrIcon className="size-4" />
              <span>{showQr ? t('trash_bank_hide_qr') : t('trash_bank_show_qr')}</span>
            </button>
          </div>

          {/* STUB: Mock QR code for staff to scan at the drop-off center */}
          {showQr && (
            <div className="p-5 rounded-2xl border border-border bg-sunken flex flex-col items-center text-center space-y-3 animate-fade-in">
              <p className="text-xs font-bold text-ink">
                {t('trash_bank_qr_title')}
              </p>
              {/* Inline SVG mock QR pattern in palette colors */}
              <div className="p-3 bg-white rounded-xl border border-border">
                <svg width="136" height="136" viewBox="0 0 136 136" fill="none" role="img" aria-label={t('trash_bank_qr_title')}>
                  <rect width="136" height="136" fill="#ffffff" />
                  <rect x="10" y="10" width="36" height="36" stroke="#10180c" strokeWidth="6" />
                  <rect x="20" y="20" width="16" height="16" fill="#38761d" />
                  <rect x="90" y="10" width="36" height="36" stroke="#10180c" strokeWidth="6" />
                  <rect x="100" y="20" width="16" height="16" fill="#38761d" />
                  <rect x="10" y="90" width="36" height="36" stroke="#10180c" strokeWidth="6" />
                  <rect x="20" y="100" width="16" height="16" fill="#38761d" />
                  <rect x="56" y="14" width="8" height="8" fill="#10180c" />
                  <rect x="70" y="14" width="8" height="16" fill="#10180c" />
                  <rect x="56" y="30" width="16" height="8" fill="#38761d" />
                  <rect x="14" y="56" width="16" height="8" fill="#10180c" />
                  <rect x="38" y="56" width="8" height="16" fill="#10180c" />
                  <rect x="56" y="56" width="24" height="24" fill="#38761d" />
                  <rect x="64" y="64" width="8" height="8" fill="#ffffff" />
                  <rect x="90" y="56" width="8" height="16" fill="#10180c" />
                  <rect x="106" y="56" width="16" height="8" fill="#10180c" />
                  <rect x="56" y="90" width="16" height="8" fill="#10180c" />
                  <rect x="80" y="90" width="16" height="16" fill="#38761d" />
                  <rect x="104" y="90" width="18" height="8" fill="#10180c" />
                  <rect x="56" y="110" width="8" height="14" fill="#10180c" />
                  <rect x="96" y="112" width="26" height="12" fill="#10180c" />
                </svg>
              </div>
              <p className="text-xs font-bold text-ink tabular">
                {t('trash_bank_qr_code_label', { id: memberCode })}
              </p>
            </div>
          )}

          {/* Mandatory weigh-in note */}
          <p className="text-xs text-muted text-pretty border-t border-border-light pt-3">
            {t('trash_bank_weigh_note')}
          </p>
        </section>
      ) : (
        /* === DROP-OFF CENTERS LIST === */
        <section className="border border-border rounded-2xl bg-white p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-ink text-balance">{t('trash_bank_title')}</h2>
            <p className="text-xs text-muted text-pretty mt-0.5">{t('trash_bank_subtitle')}</p>
          </div>

          <div className="divide-y divide-border">
            {centers.map(center => (
              <button
                key={center.id}
                type="button"
                onClick={() => setSelectedCenterId(center.id)}
                className="w-full py-4 first:pt-1 last:pb-1 flex items-center justify-between gap-4 text-left hover:bg-sunken/70 px-2.5 -mx-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-ink">{center.name}</p>
                    <span className="text-xs text-muted tabular">
                      · {t('distance_km', { km: center.distanceKm })}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{center.area}</p>
                  <p className="text-[11px] text-muted tabular">{formatHoursSummary(center)}</p>
                  <div className="pt-0.5">
                    <OpenStatusBadge point={center} />
                  </div>
                </div>
                <ChevronRightIcon className="size-4 text-muted shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* === DROP-OFF HISTORY === */}
      <section className="border border-border rounded-2xl bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-ink text-balance">{t('trash_bank_history_title')}</h3>
          <span className="text-[11px] text-muted-light">{t('sample_data_note')}</span>
        </div>

        {history.length === 0 ? (
          <EmptyState
            title={t('trash_bank_history_empty')}
            description={t('trash_bank_history_empty_desc')}
          />
        ) : (
          <div className="divide-y divide-border">
            {history.map(item => {
              const center = centers.find(c => c.id === item.dropPointId);
              return (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-semibold text-ink truncate">
                      {center?.name || 'Trash Bank Center'}
                    </p>
                    <p className="text-xs text-muted tabular">
                      {formatShortDate(item.date)}
                      {item.kg ? ` · ${item.kg} ${t('home_kg')}` : ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {item.points ? (
                      <p className="text-sm font-bold text-primary tabular">+{item.points} pts</p>
                    ) : (
                      <p className="text-xs font-semibold text-yellow-dark">
                        {t('trash_bank_awaiting_weigh')}
                      </p>
                    )}
                    <p className="text-[11px] text-muted">
                      {item.points ? t('trash_bank_credited') : item.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
