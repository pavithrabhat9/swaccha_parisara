import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useApp } from '../lib/AppContext';
import { wasteTypes } from '../data/politicians';
import { v4 as uuidv4 } from 'uuid';

export default function ReportModal() {
  const { t } = useTranslation();
  const {
    showReportModal,
    setShowReportModal,
    currentWard,
    currentPoliticians,
    userLocation,
    locationLoading,
    locationError,
    fetchComplaints,
    addLocalComplaint,
    dbAvailable,
    detectLocationAndWard
  } = useApp();

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [landmark, setLandmark] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const fileInputRef = useRef(null);

  // When modal opens, detect location -> ward -> politicians
  useEffect(() => {
    if (showReportModal) {
      setDetecting(true);
      detectLocationAndWard().finally(() => setDetecting(false));
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore background scroll
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showReportModal, detectLocationAndWard]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Only JPG, PNG, or WebP formats allowed' }));
      return;
    }
    setPhoto(file);
    setErrors(prev => ({ ...prev, photo: null }));
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setPhoto(null);
    setPhotoPreview(null);
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!photo) newErrors.photo = 'Please capture or upload a photo';
    if (!landmark.trim()) newErrors.landmark = 'Please describe the location';
    else if (landmark.length > 200) newErrors.landmark = 'Maximum 200 characters allowed';
    if (!wasteType) newErrors.wasteType = 'Please select the type of waste';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      let photoUrl = '';
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('complaint-photos')
          .upload(fileName, photo);
        if (uploadError) {
          photoUrl = photoPreview;
        } else {
          const { data: urlData } = supabase.storage
            .from('complaint-photos')
            .getPublicUrl(fileName);
          photoUrl = urlData?.publicUrl || photoPreview;
        }
      }

      const complaintData = {
        lat_public: userLocation?.lat || 12.91,
        lng_public: userLocation?.lng || 74.86,
        ward_id: currentWard?.ward_id || null,
        photo_url: photoUrl || photoPreview,
        landmark_description: landmark.trim(),
        waste_type: wasteType,
        status: 'unresolved',
        reported_at: new Date().toISOString()
      };

      let result;
      if (dbAvailable) {
        const { data, error } = await supabase
          .from('complaints')
          .insert([complaintData])
          .select()
          .single();
        if (!error && data) result = data;
      }
      if (!result) {
        result = addLocalComplaint(complaintData);
      }

      setSubmittedComplaint(result);
      setSubmitted(true);
      fetchComplaints();
    } catch (err) {
      setErrors({ submit: 'Failed to submit report. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowReportModal(false);
    setSubmitted(false);
    setSubmittedComplaint(null);
    setPhoto(null);
    setPhotoPreview(null);
    setLandmark('');
    setWasteType('');
    setErrors({});
  };

  if (!showReportModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        {/* SUCCESS VIEW */}
        {submitted && submittedComplaint ? (
          <div className="modal-body" style={{ textAlign: 'center', paddingTop: '8px' }}>
            {/* Green check icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#009B4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{t('reportSubmitted')}</h2>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#009B4D', margin: '0 0 20px', lineHeight: 1.4 }}>
              {t('thankYou')}
            </p>

            {/* Uploaded Photo Preview — full width no blank space */}
            {photoPreview && (
              <div style={{
                width: '100%', borderRadius: '14px', overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid #E5E5EA', marginBottom: '20px'
              }}>
                <img src={photoPreview} alt="Reported waste" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '200px' }} />
              </div>
            )}

            {/* Complaint ID */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#F2F2F7', borderRadius: '10px',
              padding: '8px 16px', marginBottom: '20px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#8E8E93' }}>{t('referenceId')}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                {submittedComplaint.id?.slice(0, 8) || 'N/A'}
              </span>
            </div>

            {/* Summary card */}
            <div style={{
              background: '#FFFFFF', borderRadius: '14px', padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E5EA',
              textAlign: 'left', marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F2F2F7', fontSize: '13px' }}>
                <span style={{ color: '#8E8E93' }}>{t('ward')}</span>
                <span style={{ fontWeight: 600, color: '#1C1C1E' }}>{currentWard?.ward_name || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F2F2F7', fontSize: '13px' }}>
                <span style={{ color: '#8E8E93' }}>{t('garbageType')}</span>
                <span style={{ fontWeight: 600, color: '#1C1C1E' }}>{submittedComplaint.waste_type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F2F2F7', fontSize: '13px' }}>
                <span style={{ color: '#8E8E93' }}>{t('location')}</span>
                <span style={{ fontWeight: 600, color: '#1C1C1E', textAlign: 'right', maxWidth: '180px' }}>{submittedComplaint.landmark_description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
                <span style={{ color: '#8E8E93' }}>{t('date')}</span>
                <span style={{ fontWeight: 600, color: '#1C1C1E' }}>{new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => { setSubmitted(false); setSubmittedComplaint(null); setPhoto(null); setPhotoPreview(null); setLandmark(''); setWasteType(''); setErrors({}); }}
                style={{
                  flex: 1, padding: '13px 0', border: '1.5px solid #E5E5EA', borderRadius: '12px',
                  background: '#FFFFFF', fontSize: '15px', fontWeight: 600, color: '#1C1C1E',
                  cursor: 'pointer', fontFamily: 'var(--font-family)'
                }}>
                {t('reportAnother')}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleClose}
                style={{ flex: 1, height: 'auto', padding: '13px 0' }}>
                {t('close')}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky Header — title + ward info, fixed at top */}
            <div className="modal-sticky-header">
              <h2 className="modal-title" style={{ marginBottom: '4px' }}>{t('reportGarbage')}</h2>

              {/* Ward details — tiny text, directly under the title, no icon */}
              {detecting || locationLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div className="spinner" style={{ width: '14px', height: '14px', margin: 0, borderWidth: '2px' }} />
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', margin: 0 }}>{t('detectingLocation')}</p>
                </div>
              ) : currentWard ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93' }}>
                    {currentWard.ward_name} &middot; Ward No. {currentWard.ward_no}
                  </span>
                  {locationError && (
                    <span style={{ fontSize: '11px', color: '#DC3545', fontWeight: 500 }}>{locationError}</span>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: '#DC3545', margin: '0', fontWeight: 500 }}>{t('unableToDetectLocation')}</p>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="modal-scrollable">
              {/* Politician cards — both green, party name in line with name */}
              {currentPoliticians && !detecting && !locationLoading && (
                <div style={{
                  display: 'flex', gap: '12px', marginBottom: '24px'
                }}>
                  {/* MLA Card */}
                  <div style={{
                      flex: 1,
                      background: '#FFFFFF', borderRadius: '14px', padding: '14px 12px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E5EA',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
                    }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {currentPoliticians.mla_photoUrl ? (
                        <img src={currentPoliticians.mla_photoUrl} alt={currentPoliticians.mla_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '\u{1F3DB}\uFE0F'}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MLA</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E', textAlign: 'center', lineHeight: 1.3 }}>
                      {currentPoliticians.mla_name}
                      {currentPoliticians.mla_party && (
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#009B4D' }}> &middot; {currentPoliticians.mla_party}</span>
                      )}
                    </span>
                  </div>

                  {/* MP Card — both green now */}
                  <div style={{
                      flex: 1,
                      background: '#FFFFFF', borderRadius: '14px', padding: '14px 12px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E5EA',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
                    }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {currentPoliticians.mp_photoUrl ? (
                        <img src={currentPoliticians.mp_photoUrl} alt={currentPoliticians.mp_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '\u{1F3DB}\uFE0F'}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MP</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E', textAlign: 'center', lineHeight: 1.3 }}>
                      {currentPoliticians.mp_name}
                      {currentPoliticians.mp_party && (
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#009B4D' }}> &middot; {currentPoliticians.mp_party}</span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">{t('photo')} <span className="required">*</span></label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                  capture="environment"
                />
                {!photoPreview ? (
                  <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <div className="photo-upload-text">{t('captureOrSelectPhoto')}</div>
                    <div className="photo-upload-hint">{t('maxFileSize')}</div>
                  </div>
                ) : (
                  <div className="photo-preview-container">
                    <img src={photoPreview} alt="Preview" className="photo-preview-img" style={{ width: '100%', maxWidth: '100%' }} />
                    <div className="photo-actions">
                      <button className="btn btn-small btn-secondary" onClick={handleRetake}>{t('retake')}</button>
                      <button className="btn btn-small btn-danger" onClick={handleDeletePhoto}>{t('delete')}</button>
                    </div>
                  </div>
                )}
                {errors.photo && <div className="error-text">{errors.photo}</div>}
              </div>

              {/* Landmark */}
              <div className="form-group">
                <label className="form-label">{t('landmarkDescription')} <span className="required">*</span></label>
                <textarea
                  className={`form-textarea ${errors.landmark ? 'form-error' : ''}`}
                  placeholder={t('describeLocation')}
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  maxLength={200}
                  disabled={submitting}
                />
                <div className={`char-counter ${landmark.length > 200 ? 'over' : ''}`}>
                  {landmark.length}/200
                </div>
                {errors.landmark && <div className="error-text">{errors.landmark}</div>}
              </div>

              {/* Waste Type */}
              <div className="form-group">
                <label className="form-label">{t('typeOfWaste')} <span className="required">*</span></label>
                <div className="waste-type-grid">
                  {wasteTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`waste-type-btn ${wasteType === type ? 'selected' : ''}`}
                      onClick={() => { setWasteType(type); setErrors(prev => ({ ...prev, wasteType: null })); }}
                      disabled={submitting}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.wasteType && <div className="error-text">{errors.wasteType}</div>}
              </div>

              {/* Submit Error */}
              {errors.submit && <div className="error-box">{errors.submit}</div>}

              {/* Submit Button */}
              <div className="btn-sticky">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }} />
                      {t('submitting')}
                    </>
                  ) : (
                    t('submitReport')
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}