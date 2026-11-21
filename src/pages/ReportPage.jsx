import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { useReports } from '../hooks/useReports';
import { useToast } from '../components/ui/Toast';
import { webApiAdapter } from '../services/storageAdapter';
import SuccessState from '../components/ui/SuccessState';
import ErrorState from '../components/ui/ErrorState';
import SlowNetworkAlert from '../components/ui/SlowNetworkAlert';
import PermissionAlert from '../components/ui/PermissionAlert';
import { useNetworkStatus } from '../components/ui/OfflineBanner';
import { ArrowLeftIcon, CameraIcon, XIcon } from '../components/ui/Icons';
import { WASTE_TYPE_OPTIONS } from '../data/mockReports';
import { cn } from '../utils/cn';
import 'leaflet/dist/leaflet.css';

const pinIcon = L.divIcon({
  className: 'report-pin',
  html: `<div style="
    width: 22px; height: 22px;
    background: #0d7a57;
    border-radius: 9999px;
    border: 3px solid #ffffff;
    box-shadow: 0 3px 10px rgba(13, 122, 87, 0.38);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} icon={pinIcon} /> : null;
}

/**
 * ReportPage — Anonymous Civic Waste Incident Filing Docket.
 */
export default function ReportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addReport } = useReports();
  const { showToast } = useToast();
  const { isOnline } = useNetworkStatus();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('form');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState(() =>
    typeof navigator !== 'undefined' && navigator.geolocation ? 'detecting' : 'manual'
  );
  const [wasteType, setWasteType] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSlowNetwork, setShowSlowNetwork] = useState(false);
  const [errors, setErrors] = useState({});

  const detectLocation = () => {
    setLocationStatus('detecting');
    webApiAdapter
      .getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 })
      .then((coords) => {
        setLocation(coords);
        setLocationStatus('done');
      })
      .catch(() => {
        setLocationStatus('manual');
        setLocation({ lat: 12.9141, lng: 74.8560 });
      });
  };

  useEffect(() => {
    webApiAdapter
      .getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 })
      .then((coords) => {
        setLocation(coords);
        setLocationStatus('done');
      })
      .catch(() => {
        setLocationStatus('manual');
        setLocation({ lat: 12.9141, lng: 74.8560 });
      });
  }, []);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: t('report_max_file_size_error') }));
      return;
    }
    setPhoto(file);
    setErrors(prev => ({ ...prev, photo: null }));
    try {
      const dataUrl = await webApiAdapter.readFileAsDataUrl(file);
      setPhotoPreview(dataUrl);
    } catch {
      // ignore file read error
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!wasteType) newErrors.wasteType = t('report_select_waste_type_error');
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);
    setShowSlowNetwork(false);

    if (!isOnline) {
      setTimeout(() => {
        setSubmitting(false);
        setStep('offlineSaved');
        showToast('Report saved offline. It will submit automatically when you reconnect.', 'info', 4000);
      }, 500);
      return;
    }

    const slowTimer = setTimeout(() => {
      setShowSlowNetwork(true);
    }, 5000);

    setTimeout(() => {
      clearTimeout(slowTimer);
      setShowSlowNetwork(false);
      addReport({
        lat: location?.lat || 12.9141,
        lng: location?.lng || 74.8560,
        placeName: 'New Report',
        wasteType,
        note: note.trim(),
        photoUrl: photoPreview || 'https://picsum.photos/seed/newreport/400/300',
        photoName: photo?.name,
      });
      setSubmitting(false);
      setStep('success');
    }, 800);
  };

  const resetForm = () => {
    setStep('form');
    setPhoto(null);
    setPhotoPreview(null);
    setWasteType('');
    setNote('');
    setErrors({});
    setSubmissionError(null);
    setShowSlowNetwork(false);
    detectLocation();
  };

  if (step === 'offlineSaved') {
    return (
      <SuccessState
        title={t('report_offline_saved_title')}
        description={t('report_offline_saved_description')}
        actionLabel={t('reportAnother')}
        onAction={resetForm}
      />
    );
  }

  if (step === 'success') {
    return (
      <SuccessState
        title={t('reportAdded')}
        description={t('reportConfirmation')}
        actionLabel={t('reportAnother')}
        onAction={resetForm}
        secondaryActionLabel={t('map')}
        onSecondaryAction={() => navigate('/map')}
      >
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Reported waste"
            className="w-full max-w-xs h-40 object-cover rounded-xl border border-border mb-4 mx-auto"
          />
        )}

        <div className="bg-white rounded-xl border border-border divide-y divide-border-light w-full max-w-xs mx-auto">
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-xs text-muted">{t('report_detail_type')}</span>
            <span className="text-xs font-semibold text-ink">{wasteType}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-xs text-muted">{t('report_detail_status')}</span>
            <span className="text-xs font-semibold text-primary">{t('addedToMap')}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-xs text-muted">{t('report_detail_location')}</span>
            <span className="font-mono-data text-xs font-semibold text-ink">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Mangaluru'}
            </span>
          </div>
        </div>
      </SuccessState>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      <button
        type="button"
        onClick={() => navigate('/map')}
        className="min-h-10 -ml-2 px-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 cursor-pointer rounded-lg"
      >
        <ArrowLeftIcon className="size-4" />
        <span>{t('map')}</span>
      </button>

      <section className="rounded-xl border border-border bg-white p-5 space-y-5">
        <div className="pb-4 border-b border-border-light">
          <h1 className="text-xl font-bold text-ink text-balance">{t('reportPlasticWaste')}</h1>
          <p className="text-xs text-muted text-pretty mt-1">{t('reportDescription')}</p>
        </div>

        {/* PHOTO */}
        <div>
          <span className="block text-xs font-semibold text-ink mb-1.5">
            {t('photo')} <span className="text-muted font-normal">({t('optional')})</span>
          </span>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
            capture="environment"
          />
          {!photoPreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border border-dashed border-border rounded-lg bg-cream flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary-lighter/50 transition-colors duration-150 press-scale cursor-pointer"
            >
              <CameraIcon className="size-5 text-primary" />
              <span className="text-xs font-semibold text-ink">{t('tapToCapture')}</span>
              <span className="font-mono-data text-[10px] text-muted">{t('maxFileSize')}</span>
            </button>
          ) : (
            <div className="relative">
              <img src={photoPreview} alt="Selected waste preview" className="w-full h-44 object-cover rounded-lg border border-border" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                className="touch-target absolute top-2 right-2 size-10 bg-ink/80 text-white rounded-lg flex items-center justify-center hover:bg-ink transition-colors duration-150 cursor-pointer"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          )}
          {errors.photo && (
            <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.photo}</p>
          )}
        </div>

        {/* LOCATION */}
        <div>
          <span className="block text-xs font-semibold text-ink mb-1.5">
            {t('location')}
          </span>
          {locationStatus === 'detecting' && (
            <div className="flex items-center gap-2 text-xs text-muted py-2" role="status">
              <div className="size-4 border-2 border-border border-t-primary rounded-full animate-spin" />
              <span>{t('detectingLocation')}</span>
            </div>
          )}
          {locationStatus === 'done' && (
            <div className="flex items-center justify-between gap-2 text-xs text-primary font-semibold py-1">
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{t('gpsLocationCaptured')}</span>
                {location && (
                  <span className="font-mono-data text-[11px] text-muted font-normal">
                    ({location.lat.toFixed(3)}, {location.lng.toFixed(3)})
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setLocationStatus('manual')}
                className="min-h-9 px-2 text-muted hover:text-ink underline text-xs font-medium cursor-pointer rounded-md"
              >
                {t('adjustManually')}
              </button>
            </div>
          )}
          {locationStatus === 'manual' && (
            <div className="space-y-2.5">
              <PermissionAlert
                title={t('ui_location_access_denied')}
                message={t('ui_location_access_denied_desc')}
                fallbackLabel={t('ui_place_pin_below')}
              />
              <div className="rounded-lg overflow-hidden border border-border" style={{ height: '176px' }}>
                <MapContainer
                  center={[location?.lat || 12.9141, location?.lng || 74.8560]}
                  zoom={14}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  style={{ height: '148px', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={location} setPosition={setLocation} />
                </MapContainer>
                <p className="text-[11px] text-muted text-center py-1 bg-sunken border-t border-border">
                  {t('tapMapToPin')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* WASTE TYPE */}
        <div>
          <span className="block text-xs font-semibold text-ink mb-2">
            {t('wasteType')} <span className="text-orange-red-dark" aria-hidden="true">*</span>
          </span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('wasteType')}>
            {WASTE_TYPE_OPTIONS.map(type => {
              const selected = wasteType === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => { setWasteType(type); setErrors(prev => ({ ...prev, wasteType: null })); }}
                  className={cn(
                    'min-h-10 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 press-scale border cursor-pointer',
                    selected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-ink border-border hover:border-primary/50 hover:bg-sunken'
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
          {errors.wasteType && (
            <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.wasteType}</p>
          )}
        </div>

        {/* NOTE */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor="report-note" className="text-xs font-semibold text-ink">
              {t('note')} <span className="text-muted font-normal">({t('optional')})</span>
            </label>
            <span className="font-mono-data text-[11px] text-muted">{note.length}/200</span>
          </div>
          <textarea
            id="report-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('notePlaceholder')}
            maxLength={200}
            rows={3}
            className="w-full px-3.5 py-3 border border-border rounded-lg text-sm bg-white text-ink placeholder:text-muted-light resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {showSlowNetwork && (
          <SlowNetworkAlert
            onRetry={handleSubmit}
            onCancel={() => { setShowSlowNetwork(false); setSubmitting(false); }}
          />
        )}

        {submissionError && (
          <ErrorState
            title={t('report_submission_failed_title')}
            description={submissionError}
            onRetry={handleSubmit}
          />
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full min-h-12 py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary-dark active:scale-[0.985] transition-[transform,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('submitting')}</span>
            </>
          ) : (
            t('submitReport')
          )}
        </button>
      </section>
    </div>
  );
}
