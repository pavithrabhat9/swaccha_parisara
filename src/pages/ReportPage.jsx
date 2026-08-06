import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { useReports } from '../hooks/useReports';
import { useToast } from '../components/ui/Toast';
import SuccessState from '../components/ui/SuccessState';
import ErrorState from '../components/ui/ErrorState';
import SlowNetworkAlert from '../components/ui/SlowNetworkAlert';
import PermissionAlert from '../components/ui/PermissionAlert';
import { useNetworkStatus } from '../components/ui/OfflineBanner';
import { WASTE_TYPE_OPTIONS } from '../data/mockReports';
import 'leaflet/dist/leaflet.css';

// Pin icon for manual placement
const pinIcon = L.divIcon({
  className: 'report-pin',
  html: `<div style="
    width: 20px; height: 20px;
    background: #38761d;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(56,118,29,0.4);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Map click handler for manual pin placement
function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} icon={pinIcon} /> : null;
}

/**
 * ReportPage — Anonymous plastic waste reporting flow.
 * Steps: Photo → Location → Waste type → Note → Submit → Success
 */
export default function ReportPage() {
  const { t } = useTranslation();
  const { addReport } = useReports();
  const { showToast } = useToast();
  const { isOnline } = useNetworkStatus();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('form'); // 'form' | 'success' | 'offlineSaved'
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState(() =>
    typeof navigator !== 'undefined' && navigator.geolocation ? 'detecting' : 'manual'
  ); // 'idle' | 'detecting' | 'done' | 'manual'
  const [wasteType, setWasteType] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSlowNetwork, setShowSlowNetwork] = useState(false);
  const [errors, setErrors] = useState({});

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('manual');
      return;
    }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('done');
      },
      () => {
        setLocationStatus('manual');
        setLocation({ lat: 12.9141, lng: 74.8560 }); // Default Mangaluru
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Auto-detect GPS on mount without synchronous setState
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('done');
      },
      () => {
        setLocationStatus('manual');
        setLocation({ lat: 12.9141, lng: 74.8560 }); // Default Mangaluru
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: t('report_max_file_size_error') }));
      return;
    }
    setPhoto(file);
    setErrors(prev => ({ ...prev, photo: null }));
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
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

    // If offline, save to offline queue state
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

    // Simulate submission
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

  // === OFFLINE SAVED SCREEN ===
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

  // === SUCCESS SCREEN ===
  if (step === 'success') {
    return (
      <SuccessState
        title={t('reportAdded')}
        description={t('reportConfirmation')}
        actionLabel={t('reportAnother')}
        onAction={resetForm}
      >
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Reported waste"
            className="w-full max-w-xs h-40 object-cover rounded-xl shadow-card border border-border mb-4 mx-auto"
          />
        )}

        <div className="bg-surface rounded-xl border border-border p-4 w-full max-w-xs mx-auto shadow-card">
          <div className="flex justify-between items-center py-1.5 border-b border-border-light">
            <span className="text-xs text-muted">{t('report_detail_type')}</span>
            <span className="text-xs font-semibold text-black">{wasteType}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-border-light">
            <span className="text-xs text-muted">{t('report_detail_status')}</span>
            <span className="text-xs font-semibold text-primary">{t('addedToMap')}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-muted">{t('report_detail_location')}</span>
            <span className="text-xs font-semibold text-black">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Mangaluru'}
            </span>
          </div>
        </div>
      </SuccessState>
    );
  }

  // === REPORT FORM ===
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-black">{t('reportPlasticWaste')}</h2>
        <p className="text-sm text-muted mt-0.5">{t('reportDescription')}</p>
      </div>

      {/* === PHOTO === */}
      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
          {t('photo')} <span className="text-muted-light">({t('optional')})</span>
        </label>
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
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-border rounded-xl bg-surface
              flex flex-col items-center justify-center gap-2 hover:border-primary/40
              hover:bg-primary-lighter transition-all press-scale cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span className="text-xs font-medium text-muted">{t('tapToCapture')}</span>
            <span className="text-[10px] text-muted-light">{t('maxFileSize')}</span>
          </button>
        ) : (
          <div className="relative">
            <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl shadow-card" />
            <button
              onClick={() => { setPhoto(null); setPhotoPreview(null); }}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full
                flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        {errors.photo && <p className="text-xs text-orange-red mt-1 font-medium">{errors.photo}</p>}
      </div>

      {/* === LOCATION === */}
      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
          {t('location')}
        </label>
        {locationStatus === 'detecting' && (
          <div className="flex items-center gap-2 text-xs text-muted py-2">
            <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
            {t('detectingLocation')}
          </div>
        )}
        {locationStatus === 'done' && (
          <div className="flex items-center gap-2 text-xs text-primary font-medium py-1 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {t('gpsLocationCaptured')}
            <button onClick={() => setLocationStatus('manual')} className="text-muted underline ml-auto text-[10px]">
              {t('adjustManually')}
            </button>
          </div>
        )}
        {locationStatus === 'manual' && (
          <div className="space-y-2">
            <PermissionAlert
              title={t('ui_location_access_denied')}
              message={t('ui_location_access_denied_desc')}
              fallbackLabel={t('ui_place_pin_below')}
            />
            <div className="rounded-xl overflow-hidden border border-border shadow-card" style={{ height: '160px' }}>
              <MapContainer
                center={[location?.lat || 12.9141, location?.lng || 74.8560]}
                zoom={14}
                scrollWheelZoom={true}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={location} setPosition={setLocation} />
              </MapContainer>
              <p className="text-[10px] text-muted text-center py-1 bg-surface border-t border-border">
                {t('tapMapToPin')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* === WASTE TYPE === */}
      <div>
        <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
          {t('wasteType')} <span className="text-orange-red">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {WASTE_TYPE_OPTIONS.map(type => (
            <button
              key={type}
              onClick={() => { setWasteType(type); setErrors(prev => ({ ...prev, wasteType: null })); }}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all press-scale border
                ${wasteType === type
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-muted border-border hover:border-primary/40 hover:text-primary'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
        {errors.wasteType && <p className="text-xs text-orange-red mt-1.5 font-medium">{errors.wasteType}</p>}
      </div>

      {/* === NOTE === */}
      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
          {t('note')} <span className="text-muted-light">({t('optional')})</span>
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={t('notePlaceholder')}
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-surface text-black
            placeholder:text-muted-light resize-none focus:outline-none focus:border-primary
            focus:ring-2 focus:ring-primary/15 transition-all"
        />
        <p className="text-[10px] text-muted-light text-right mt-0.5">{note.length}/200</p>
      </div>

      {/* Slow Network Alert */}
      {showSlowNetwork && (
        <SlowNetworkAlert
          onRetry={handleSubmit}
          onCancel={() => { setShowSlowNetwork(false); setSubmitting(false); }}
        />
      )}

      {/* Recoverable Submission Error State */}
      {submissionError && (
        <ErrorState
          title={t('report_submission_failed_title')}
          description={submissionError}
          onRetry={handleSubmit}
        />
      )}

      {/* === SUBMIT === */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl text-sm
          hover:bg-primary-dark active:scale-[0.98] transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed shadow-fab
          flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('submitting')}
          </>
        ) : (
          t('submitReport')
        )}
      </button>
    </div>
  );
}
