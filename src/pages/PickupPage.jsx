import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { usePickups } from '../hooks/usePickups';
import { useAddresses } from '../hooks/useAddresses';
import { useToast } from '../components/ui/Toast';
import { aiApi, AI_PLASTIC_TYPES } from '../services/aiApi';
import ActivePickupCard from '../components/pickup/ActivePickupCard';
import TrashBankTab from '../components/pickup/TrashBankTab';
import BusinessPage from './BusinessPage';
import PermissionAlert from '../components/ui/PermissionAlert';
import Chip from '../components/ui/Chip';
import StatusBadge from '../components/ui/StatusBadge';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SuccessState from '../components/ui/SuccessState';
import SlowNetworkAlert from '../components/ui/SlowNetworkAlert';
import ErrorState from '../components/ui/ErrorState';
import { QUANTITY_TIERS, TIME_WINDOWS } from '../data/mockPickups';
import { getActivePickup } from '../utils/pickupStatusUtils';
import { getBagDetails } from '../utils/pickupUtils';
import { formatShortDate } from '../utils/dateUtils';
import { cn } from '../utils/cn';
import {
  MapPinIcon,
  CameraIcon,
  UploadIcon,
  XIcon,
} from '../components/ui/Icons';

/**
 * PickupPage — Collection Logistics Hub (Home Pickup | Trash Bank | Business).
 */
export default function PickupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isBusinessAccount } = useAuth();
  const { pickups, loading, requestPickup } = usePickups();
  const { addresses, defaultAddress } = useAddresses();
  const { showToast } = useToast();

  const tabParam = searchParams.get('tab');
  const centerParam = searchParams.get('center');
  const startParam = searchParams.get('start');

  const activeSegment =
    tabParam === 'trash-bank'
      ? 'trash-bank'
      : tabParam === 'business' && isBusinessAccount
        ? 'business'
        : 'home';

  const setSegment = (nextTab) => {
    setSearchParams(nextTab === 'home' ? {} : { tab: nextTab });
  };

  const [showRequestForm, setShowRequestForm] = useState(() => startParam === '1');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [selectedPlasticType, setSelectedPlasticType] = useState('PET');

  const [quantity, setQuantity] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSlowNetwork, setShowSlowNetwork] = useState(false);
  const [errors, setErrors] = useState({});

  const effectiveAddressId = selectedAddressId || defaultAddress?.id || '';

  const handlePhotoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: t('report_max_file_size_error') }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: null }));
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);

    setAiLoading(true);
    setAiResult(null);
    try {
      const prediction = await aiApi.analyzePlasticPhoto(file.name);
      setAiResult(prediction);
      setSelectedPlasticType(prediction.plasticType);
      if (!quantity && prediction.estimatedBagId) {
        setQuantity(prediction.estimatedBagId);
      }
    } catch {
      setAiResult({
        plasticType: 'PET',
        confidenceLabel: 'Sample estimate',
        estimatedBagId: 'medium',
      });
      setSelectedPlasticType('PET');
    } finally {
      setAiLoading(false);
    }
  };

  const handleOpenCamera = async () => {
    if (navigator.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: 'camera' });
        if (status.state === 'denied') {
          setCameraDenied(true);
          return;
        }
      } catch {
        // ignore if unsupported
      }
    }
    cameraInputRef.current?.click();
  };

  const handleRequestPickup = () => {
    const newErrors = {};
    if (!photoPreview) newErrors.photo = t('pickup_photo_required_error');
    if (!quantity) newErrors.quantity = 'Please select a bag size';
    if (!timeWindow) newErrors.timeWindow = 'Please select a preferred time';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const chosenAddress =
      addresses.find(a => a.id === effectiveAddressId) || defaultAddress;
    const resolvedLocality = chosenAddress?.locality || user?.locality || 'Kadri';

    setSubmitting(true);
    setSubmissionError(null);
    setShowSlowNetwork(false);

    const slowTimer = setTimeout(() => {
      setShowSlowNetwork(true);
    }, 5000);

    setTimeout(() => {
      clearTimeout(slowTimer);
      setShowSlowNetwork(false);
      requestPickup({
        quantity,
        locality: resolvedLocality,
        timeWindow,
        plasticType: selectedPlasticType,
      });
      setSubmitting(false);
      setShowRequestForm(false);
      setShowSuccessModal(true);
      setPhotoPreview(null);
      setAiResult(null);
      setQuantity('');
      setTimeWindow('');
      setErrors({});
      showToast('Pickup requested successfully!', 'success', 3000);
    }, 600);
  };

  const completedCount = pickups.filter(p => p.status === 'Completed').length;
  const pendingCount = pickups.filter(p => p.status !== 'Completed').length;
  const activePickup = getActivePickup(pickups);

  const filteredPickups = pickups.filter(p => {
    if (historyFilter === 'completed') return p.status === 'Completed';
    if (historyFilter === 'pending') return p.status !== 'Completed';
    return true;
  });

  const segments = [
    { id: 'home', label: t('pickup_tab_home') },
    { id: 'trash-bank', label: t('pickup_tab_trash_bank') },
    ...(isBusinessAccount ? [{ id: 'business', label: t('pickup_tab_business') }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* === HEADER + SEGMENTED SERVICE SWITCH === */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-ink tracking-tight text-balance">
          {t('pickup')}
        </h1>

        <div
          role="tablist"
          aria-label={t('pickup')}
          className="inline-flex w-full sm:w-auto p-1 rounded-2xl bg-sunken"
        >
          {segments.map(seg => {
            const active = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSegment(seg.id)}
                className={cn(
                  'flex-1 sm:flex-initial min-h-9 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer',
                  active
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-muted hover:text-ink'
                )}
              >
                {seg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* === SEGMENT 1: HOME PICKUP === */}
      {activeSegment === 'home' && (
        <>
          {loading && pickups.length === 0 ? (
            <div className="space-y-4" aria-busy="true">
              <Skeleton width="200px" height="24px" rounded="sm" />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT COLUMN: Request Home Pickup Wizard */}
              <div className="md:col-span-5 space-y-5">
                {!showRequestForm ? (
                  <section className="rounded-2xl card-elevated p-5 sm:p-6 space-y-4">
                    <div>
                      <h2 className="text-base font-extrabold text-ink tracking-tight text-balance">{t('homePickup')}</h2>
                      <p className="text-xs text-muted text-pretty mt-1 leading-relaxed">
                        {t('pickup_ai_no_points_note')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(true)}
                      className="w-full min-h-12 py-3 px-4 bg-primary text-white font-bold rounded-xl text-sm shadow-[0_6px_18px_-3px_rgba(13,122,87,0.38)] hover:bg-primary-dark transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer press-scale"
                    >
                      <CameraIcon className="size-4.5" />
                      <span>{t('requestHomePickup')}</span>
                    </button>
                  </section>
                ) : (
                  <section className="rounded-2xl card-elevated p-5 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-border-light">
                      <h1 className="text-base font-bold text-ink text-balance">{t('requestPickup')}</h1>
                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        className="touch-target size-10 flex items-center justify-center text-muted hover:text-ink hover:bg-sunken cursor-pointer rounded-lg"
                        title="Close"
                        aria-label="Close"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </div>

                    {/* STEP 1: PHOTO */}
                    <div className="space-y-2.5">
                      <span className="block text-xs font-bold text-ink">
                        {t('pickup_step_1_photo')}
                      </span>

                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoFile}
                        className="hidden"
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFile}
                        className="hidden"
                      />

                      {cameraDenied && (
                        <PermissionAlert
                          title={t('pickup_camera_denied_title')}
                          message={t('pickup_camera_denied_msg')}
                          fallbackLabel={t('pickup_upload_file')}
                          onFallback={() => fileInputRef.current?.click()}
                        />
                      )}

                      {photoPreview ? (
                        <div className="space-y-2.5">
                          <div className="relative rounded-lg overflow-hidden border border-border bg-sunken h-40">
                            <img
                              src={photoPreview}
                              alt="Plastic waste preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="min-h-10 px-3.5 py-2 rounded-lg border border-border text-xs font-semibold text-ink hover:border-primary/40 hover:bg-sunken cursor-pointer"
                          >
                            {t('pickup_change_photo')}
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={handleOpenCamera}
                            className="min-h-12 py-3 px-3 rounded-lg border border-border bg-cream hover:border-primary hover:bg-primary-lighter text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                          >
                            <CameraIcon className="size-4 text-primary" />
                            <span>{t('pickup_use_camera')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="min-h-12 py-3 px-3 rounded-lg border border-border bg-cream hover:border-primary hover:bg-primary-lighter text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                          >
                            <UploadIcon className="size-4 text-primary" />
                            <span>{t('pickup_upload_file')}</span>
                          </button>
                        </div>
                      )}

                      {errors.photo && (
                        <p role="alert" className="text-xs text-orange-red-dark font-semibold">{errors.photo}</p>
                      )}
                    </div>

                    {/* STEP 2: AI CLASSIFICATION */}
                    {(aiLoading || aiResult) && (
                      <div className="p-4 rounded-lg border border-border bg-cream space-y-3">
                        <p className="text-xs font-bold text-ink">
                          {t('pickup_step_2_ai')}
                        </p>

                        {aiLoading ? (
                          <div className="space-y-2" aria-live="polite">
                            <p className="text-xs font-medium text-ink">{t('pickup_ai_analyzing')}</p>
                            <Skeleton width="100%" height="28px" rounded="sm" />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-muted">{t('pickup_ai_suggested_type')}:</span>
                              <span className="font-mono-data font-bold text-primary">{selectedPlasticType}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-muted">{t('pickup_ai_confidence')}:</span>
                              <span className="font-medium text-ink">{aiResult.confidenceLabel}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-muted">{t('pickup_ai_estimated_bag')}:</span>
                              <span className="font-medium text-ink">
                                {QUANTITY_TIERS.find(q => q.id === aiResult.estimatedBagId)?.label || 'Medium Bag'}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-border space-y-1.5">
                              <p className="text-[11px] font-medium text-muted">
                                {t('pickup_ai_edit_type')}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {AI_PLASTIC_TYPES.map(type => (
                                  <Chip
                                    key={type}
                                    size="sm"
                                    selected={selectedPlasticType === type}
                                    onClick={() => setSelectedPlasticType(type)}
                                  >
                                    {type}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        <p className="text-[11px] font-semibold text-ink text-pretty pt-1 border-t border-border">
                          {t('pickup_ai_no_points_note')}
                        </p>
                      </div>
                    )}

                    {/* STEP 3: DETAILS */}
                    <div className="space-y-4 pt-1">
                      <p className="text-xs font-bold text-ink">
                        {t('pickup_step_3_details')}
                      </p>

                      <div>
                        <span className="block text-xs font-semibold text-ink mb-2">
                          {t('quantity')}
                        </span>
                        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t('quantity')}>
                          {QUANTITY_TIERS.map(tier => {
                            const selected = quantity === tier.id;
                            return (
                              <button
                                key={tier.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => { setQuantity(tier.id); setErrors(prev => ({ ...prev, quantity: null })); }}
                                className={cn(
                                  'min-h-12 py-2.5 px-2 rounded-lg border text-center transition-colors duration-150 cursor-pointer',
                                  selected
                                    ? 'border-primary text-primary-dark bg-primary-lighter'
                                    : 'border-border bg-white text-ink hover:border-primary/40'
                                )}
                              >
                                <p className={cn('text-xs font-semibold', selected ? 'text-primary-dark' : 'text-ink')}>
                                  {tier.label}
                                </p>
                                <p className="font-mono-data text-[10px] text-muted mt-0.5">{tier.description}</p>
                              </button>
                            );
                          })}
                        </div>
                        {errors.quantity && (
                          <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.quantity}</p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label htmlFor="pickup-address-select" className="text-xs font-semibold text-ink">
                            {t('pickup_saved_address_label')}
                          </label>
                          <button
                            type="button"
                            onClick={() => navigate('/profile?section=addresses')}
                            className="min-h-8 px-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                          >
                            {t('pickup_manage_addresses')}
                          </button>
                        </div>
                        <select
                          id="pickup-address-select"
                          value={effectiveAddressId}
                          onChange={e => setSelectedAddressId(e.target.value)}
                          className="w-full min-h-11 px-3.5 py-2.5 border border-border rounded-lg text-xs bg-white text-ink focus:outline-none focus:border-primary cursor-pointer"
                        >
                          {addresses.map(addr => (
                            <option key={addr.id} value={addr.id}>
                              {addr.label} — {addr.line} ({addr.locality})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-ink mb-2">
                          {t('preferredTime')}
                        </span>
                        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('preferredTime')}>
                          {TIME_WINDOWS.map(tw => {
                            const selected = timeWindow === tw.id;
                            return (
                              <button
                                key={tw.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => { setTimeWindow(tw.id); setErrors(prev => ({ ...prev, timeWindow: null })); }}
                                className={cn(
                                  'min-h-11 py-2.5 px-3 rounded-lg border font-mono-data text-xs font-semibold transition-colors duration-150 cursor-pointer',
                                  selected
                                    ? 'border-primary text-primary-dark bg-primary-lighter'
                                    : 'border-border bg-white text-ink hover:border-primary/40'
                                )}
                              >
                                {tw.label}
                              </button>
                            );
                          })}
                        </div>
                        {errors.timeWindow && (
                          <p role="alert" className="text-xs text-orange-red-dark mt-1.5 font-semibold">{errors.timeWindow}</p>
                        )}
                      </div>
                    </div>

                    {showSlowNetwork && (
                      <SlowNetworkAlert
                        onRetry={handleRequestPickup}
                        onCancel={() => { setShowSlowNetwork(false); setSubmitting(false); }}
                      />
                    )}

                    {submissionError && (
                      <ErrorState
                        title="Request Failed"
                        description={submissionError}
                        onRetry={handleRequestPickup}
                      />
                    )}

                    <button
                      type="button"
                      onClick={handleRequestPickup}
                      disabled={submitting}
                      className="w-full min-h-11 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary-dark transition-colors duration-150 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Scheduling…</span>
                        </>
                      ) : (
                        t('confirmPickup')
                      )}
                    </button>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN: Active Request Docket + History Ledger */}
              <div className="md:col-span-7 space-y-6">
                {activePickup && (
                  <ActivePickupCard
                    pickup={activePickup}
                    title={t('pickup_active_request_title')}
                  />
                )}

                <section className="rounded-2xl card-elevated overflow-hidden">
                  <div className="px-5 pt-5 pb-0 border-b border-border-light">
                    <h2 className="text-base font-extrabold text-ink tracking-tight text-balance mb-3">{t('pickupHistory')}</h2>

                    <div className="flex items-center gap-6" role="tablist">
                      {[
                        { id: 'all', label: 'Total', count: pickups.length },
                        { id: 'completed', label: 'Completed', count: completedCount },
                        { id: 'pending', label: 'Pending', count: pendingCount },
                      ].map(tab => {
                        const active = historyFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setHistoryFilter(tab.id)}
                            className={cn(
                              'min-h-10 pb-2.5 text-xs transition-colors duration-150 cursor-pointer border-b-2 -mb-px flex items-center gap-1.5',
                              active
                                ? 'border-primary text-ink font-bold'
                                : 'border-transparent text-muted hover:text-ink font-medium'
                            )}
                          >
                            <span>{tab.label}</span>
                            <span className={cn('tabular', active ? 'text-primary font-extrabold' : 'text-muted')}>
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    {filteredPickups.length === 0 ? (
                      <div className="p-5">
                        <EmptyState
                          title={t('noPickupsYet')}
                          description={t('requestFirst')}
                          actionLabel={t('requestHomePickup')}
                          onAction={() => setShowRequestForm(true)}
                        />
                      </div>
                    ) : (
                      <div className="divide-y divide-border-light">
                        {filteredPickups.map(pickup => {
                          const bag = getBagDetails(pickup.quantity);
                          return (
                            <div
                              key={pickup.id}
                              className="px-5 py-4 flex items-start justify-between gap-4"
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                <div
                                  className="size-11 rounded-xl bg-primary-lighter flex items-center justify-center text-primary shrink-0"
                                  title={bag.label}
                                >
                                  {bag.icon}
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    <p className="text-sm font-bold text-ink leading-snug">
                                      {pickup.quantity}
                                    </p>
                                    <span className="tabular text-xs font-medium text-muted">{bag.weight}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                                    <span className="inline-flex items-center gap-1 text-ink/85 font-medium">
                                      <MapPinIcon className="size-3.5 text-primary shrink-0" />
                                      <span>{pickup.locality || user?.locality || 'Dakshina Kannada'}</span>
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span className="tabular">{formatShortDate(pickup.date)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0 space-y-1">
                                <StatusBadge status={pickup.status} />
                                {pickup.pointsEarned ? (
                                  <p className="tabular text-xs font-extrabold text-primary">
                                    +{pickup.pointsEarned} pts
                                  </p>
                                ) : (
                                  <p className="text-[11px] font-medium text-muted">
                                    {t('trash_bank_awaiting_weigh')}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </>
      )}

      {/* === SEGMENT 2: TRASH BANK === */}
      {activeSegment === 'trash-bank' && (
        <TrashBankTab key={centerParam || 'list'} initialCenterId={centerParam} />
      )}

      {/* === SEGMENT 3: BUSINESS === */}
      {activeSegment === 'business' && isBusinessAccount && (
        <BusinessPage />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-border shadow-modal">
            <SuccessState
              title="Pickup Scheduled!"
              description={t('pickup_ai_no_points_note')}
              actionLabel="Done"
              onAction={() => setShowSuccessModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
