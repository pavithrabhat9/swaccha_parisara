import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../hooks/useReports';
import { useToast } from '../components/ui/Toast';
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
  const { addReport } = useReports();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'detecting' | 'done' | 'manual'
  const [wasteType, setWasteType] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-detect GPS on mount
  useEffect(() => {
    detectLocation();
  }, []);

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

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Max file size is 5MB' }));
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
    if (!wasteType) newErrors.wasteType = 'Please select a waste type';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    // Simulate brief submission delay
    setTimeout(() => {
      addReport({
        lat: location?.lat || 12.9141,
        lng: location?.lng || 74.8560,
        placeName: 'New Report',
        wasteType,
        note: note.trim(),
        photoUrl: photoPreview || 'https://picsum.photos/seed/newreport/400/300',
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
    detectLocation();
  };

  // === SUCCESS SCREEN ===
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 animate-fade-in-up">
        {/* Checkmark animation */}
        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mb-6 animate-scale-in">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38761d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 24, strokeDashoffset: 0, animation: 'checkmark 0.5s ease-out 0.3s both' }}/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-black mb-2 text-center">
          Report Added
        </h2>
        <p className="text-sm text-muted text-center max-w-xs mb-2 leading-relaxed">
          Thanks — this has been added to our tracking map. We'll notify you if you're logged in when it's cleared.
        </p>

        {/* Photo preview */}
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Reported waste"
            className="w-full max-w-xs h-40 object-cover rounded-xl shadow-card border border-border mb-6"
          />
        )}

        <div className="bg-surface rounded-xl border border-border p-4 w-full max-w-xs mb-6 shadow-card">
          <div className="flex justify-between items-center py-1.5 border-b border-border-light">
            <span className="text-xs text-muted">Type</span>
            <span className="text-xs font-semibold text-black">{wasteType}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-border-light">
            <span className="text-xs text-muted">Status</span>
            <span className="text-xs font-semibold text-primary">Added to Map</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-muted">Location</span>
            <span className="text-xs font-semibold text-black">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Mangaluru'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={resetForm}
            className="flex-1 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-black
              hover:bg-border-light active:scale-[0.98] transition-all"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  // === REPORT FORM ===
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-black">Report Plastic Waste</h2>
        <p className="text-sm text-muted mt-0.5">No login required. Help us track and clear plastic waste in Dakshina Kannada.</p>
      </div>

      {/* === PHOTO === */}
      <div>
        <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
          Photo <span className="text-muted-light">(optional)</span>
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
            <span className="text-xs font-medium text-muted">Tap to capture or upload photo</span>
            <span className="text-[10px] text-muted-light">JPG, PNG, WebP • Max 5MB</span>
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
          Location
        </label>
        {locationStatus === 'detecting' && (
          <div className="flex items-center gap-2 text-xs text-muted py-2">
            <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
            Detecting your location…
          </div>
        )}
        {locationStatus === 'done' && (
          <div className="flex items-center gap-2 text-xs text-primary font-medium py-1 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            GPS location captured
            <button onClick={() => setLocationStatus('manual')} className="text-muted underline ml-auto text-[10px]">
              Adjust manually
            </button>
          </div>
        )}
        {(locationStatus === 'manual' || locationStatus === 'done') && locationStatus === 'manual' && (
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
              Tap the map to place your pin
            </p>
          </div>
        )}
      </div>

      {/* === WASTE TYPE === */}
      <div>
        <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
          Waste Type <span className="text-orange-red">*</span>
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
          Note <span className="text-muted-light">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Describe the location or situation (e.g., near the bus stop, piled up for days)"
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-surface text-black
            placeholder:text-muted-light resize-none focus:outline-none focus:border-primary
            focus:ring-2 focus:ring-primary/15 transition-all"
        />
        <p className="text-[10px] text-muted-light text-right mt-0.5">{note.length}/200</p>
      </div>

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
            Submitting…
          </>
        ) : (
          'Submit Report'
        )}
      </button>
    </div>
  );
}
