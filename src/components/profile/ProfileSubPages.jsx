import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import SuccessState from '../ui/SuccessState';
import Skeleton, { SkeletonCard } from '../ui/Skeleton';
import { DK_LOCALITIES } from '../../data/mockPickups';
import { formatShortDate } from '../../utils/dateUtils';
import { getBagDetails } from '../../utils/pickupUtils';
import { getInitials } from '../../utils/homeUtils';
import { cn } from '../../utils/cn';
import {
  CameraIcon,
  EditIcon,
  TrashIcon,
  MapPinIcon,
  CheckCircleIcon,
  XIcon,
} from '../ui/Icons';

const CARD = 'rounded-xl bg-white border border-border p-5';

export function EditProfileView({ user, onSave, onCancel }) {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [locality, setLocality] = useState(user?.locality || DK_LOCALITIES[0]);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await onSave({ name, phone: user?.phone, locality, avatarUrl });
    if (!result.success) {
      setError(t(result.error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn(CARD, 'space-y-5 max-w-xl mx-auto')}>
      <div className="flex items-center gap-4 pb-4 border-b border-border-light">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="size-16 rounded-lg object-cover border border-border"
            />
          ) : (
            <span className="size-16 rounded-lg bg-primary text-white font-mono-data text-lg font-bold flex items-center justify-center">
              {getInitials(name)}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="min-h-10 px-3.5 py-2 rounded-lg border border-border bg-sunken hover:bg-primary-lighter text-ink text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
          >
            <CameraIcon className="size-3.5 text-primary" />
            <span>{t('profile_change_photo')}</span>
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="edit-profile-name" className="block text-xs font-semibold text-ink mb-1.5">
          {t('yourName')}
        </label>
        <input
          id="edit-profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-h-11 px-3.5 py-2.5 border border-border rounded-lg text-sm bg-white text-ink focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="edit-profile-phone" className="block text-xs font-semibold text-ink mb-1.5">
          {t('phoneNumber')}
        </label>
        <input
          id="edit-profile-phone"
          type="text"
          readOnly
          disabled
          value={user?.phone ? `+91 ${user.phone}` : 'Google Account'}
          className="w-full min-h-11 px-3.5 py-2.5 border border-border rounded-lg text-sm bg-sunken text-muted font-mono-data cursor-not-allowed"
        />
        <p className="text-[11px] text-muted text-pretty mt-1">{t('profile_phone_readonly_hint')}</p>
      </div>

      <div>
        <label htmlFor="edit-profile-locality" className="block text-xs font-semibold text-ink mb-1.5">
          {t('locality')}
        </label>
        <select
          id="edit-profile-locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="w-full min-h-11 px-3.5 py-2.5 border border-border rounded-lg text-sm bg-white text-ink focus:outline-none focus:border-primary cursor-pointer"
        >
          {DK_LOCALITIES.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {error && <p role="alert" className="text-xs font-semibold text-orange-red-dark">{error}</p>}

      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="submit"
          className="flex-1 min-h-11 py-2.5 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-150 cursor-pointer"
        >
          {t('profile_save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 py-2.5 px-5 rounded-lg border border-border bg-white text-sm font-semibold text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
        >
          {t('profile_cancel')}
        </button>
      </div>
    </form>
  );
}

export function MyActivityView({ pickups, pickupsLoading, reports, reportsLoading }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('pickups');

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div
        role="tablist"
        aria-label={t('profile_row_activity_title')}
        className="grid grid-cols-2 p-1 rounded-xl bg-sunken border border-border"
      >
        {[
          { id: 'pickups', label: t('profile_activity_tab_pickups'), count: pickups.length },
          { id: 'reports', label: t('profile_activity_tab_reports'), count: reports.length },
        ].map(item => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                'min-h-10 py-2 px-4 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5',
                active ? 'bg-white text-ink border border-border shadow-xs' : 'text-muted hover:text-ink'
              )}
            >
              <span>{item.label}</span>
              <span className={cn('font-mono-data', active ? 'text-primary font-bold' : 'text-muted')}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'pickups' && (
        <section className={CARD}>
          {pickupsLoading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : pickups.length === 0 ? (
            <EmptyState
              title={t('noPickupsYet')}
              description={t('requestFirst')}
              actionLabel={t('requestHomePickup')}
              onAction={() => navigate('/pickup?tab=home&start=1')}
            />
          ) : (
            <div className="divide-y divide-border-light">
              {pickups.map(pickup => {
                const bag = getBagDetails(pickup.quantity);
                return (
                  <div
                    key={pickup.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="size-10 rounded-lg bg-sunken border border-border text-primary flex items-center justify-center shrink-0">
                        {bag.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink truncate">
                          {pickup.quantity} <span className="font-mono-data text-xs font-normal text-muted">({bag.weight})</span>
                        </p>
                        <p className="font-mono-data text-xs text-muted truncate mt-0.5">
                          {pickup.locality || 'Kadri'} · {formatShortDate(pickup.date)}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right space-y-1">
                      <StatusBadge status={pickup.status} />
                      {pickup.pointsEarned && (
                        <p className="font-mono-data text-xs font-bold text-primary">+{pickup.pointsEarned} pts</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {tab === 'reports' && (
        <section className={CARD}>
          {reportsLoading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              title={t('profile_no_reports_title')}
              description={t('profile_no_reports_desc')}
              actionLabel={t('profile_report_plastic')}
              onAction={() => navigate('/map')}
            />
          ) : (
            <div className="divide-y divide-border-light">
              {reports.map(report => (
                <div
                  key={report.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={report.photoUrl}
                      alt={report.wasteType}
                      className="size-12 rounded-lg object-cover bg-sunken border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink truncate">{report.wasteType}</p>
                      <p className="font-mono-data text-xs text-muted truncate mt-0.5">
                        {report.placeName} · {formatShortDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export function AddressListView({
  addresses,
  loading,
  error,
  onReload,
  onAdd,
  onUpdate,
  onDelete,
  onSetDefault,
  defaultLocality = 'Kadri',
}) {
  const { t } = useTranslation();
  const [formMode, setFormMode] = useState(null);
  const [label, setLabel] = useState('');
  const [line, setLine] = useState('');
  const [locality, setLocality] = useState(defaultLocality);

  const openAdd = () => {
    setLabel('');
    setLine('');
    setLocality(defaultLocality || DK_LOCALITIES[0]);
    setFormMode('add');
  };

  const openEdit = (addr) => {
    setLabel(addr.label);
    setLine(addr.line);
    setLocality(addr.locality || DK_LOCALITIES[0]);
    setFormMode(addr.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!line.trim()) return;
    if (formMode === 'add') {
      await onAdd({ label: label || 'Address', line, locality });
    } else if (formMode) {
      await onUpdate(formMode, { label: label || 'Address', line, locality });
    }
    setFormMode(null);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <ErrorState
          title={t('ui_error_default_title')}
          description={error}
          onRetry={onReload}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted text-pretty">{t('profile_addresses_subtitle')}</p>
        {!formMode && (
          <button
            type="button"
            onClick={openAdd}
            className="min-h-10 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors duration-150 cursor-pointer shrink-0"
          >
            {t('profile_address_add')}
          </button>
        )}
      </div>

      {formMode && (
        <form onSubmit={handleSubmit} className={cn(CARD, 'space-y-4')}>
          <div>
            <label htmlFor="addr-label-input" className="block text-xs font-semibold text-ink mb-1">
              {t('profile_address_label_field')}
            </label>
            <input
              id="addr-label-input"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Home"
              className="w-full min-h-11 px-3.5 py-2 border border-border rounded-lg text-sm bg-white text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="addr-line-input" className="block text-xs font-semibold text-ink mb-1">
              {t('profile_address_line_field')}
            </label>
            <input
              id="addr-line-input"
              type="text"
              required
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="Flat / Street / Landmark"
              className="w-full min-h-11 px-3.5 py-2 border border-border rounded-lg text-sm bg-white text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="addr-locality-select" className="block text-xs font-semibold text-ink mb-1">
              {t('locality')}
            </label>
            <select
              id="addr-locality-select"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full min-h-11 px-3.5 py-2 border border-border rounded-lg text-sm bg-white text-ink focus:outline-none focus:border-primary cursor-pointer"
            >
              {DK_LOCALITIES.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              className="min-h-10 px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark cursor-pointer"
            >
              {t('profile_save')}
            </button>
            <button
              type="button"
              onClick={() => setFormMode(null)}
              className="min-h-10 px-4 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-muted hover:text-ink cursor-pointer"
            >
              {t('profile_cancel')}
            </button>
          </div>
        </form>
      )}

      <section className={CARD}>
        {addresses.length === 0 ? (
          <EmptyState
            title={t('ui_empty_default_title')}
            description={t('profile_addresses_subtitle')}
            actionLabel={t('profile_address_add')}
            onAction={openAdd}
          />
        ) : (
          <div className="divide-y divide-border-light">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="size-10 rounded-lg bg-sunken border border-border text-primary flex items-center justify-center shrink-0">
                    <MapPinIcon className="size-4" />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-ink">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded bg-primary-light border border-primary/25 text-primary-dark font-mono-data text-[10px] font-semibold">
                          {t('profile_address_default_badge')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted text-pretty">
                      {addr.line} · <span className="font-semibold text-ink">{addr.locality}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => onSetDefault(addr.id)}
                      className="min-h-10 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-primary hover:border-primary cursor-pointer"
                    >
                      {t('profile_address_set_default')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(addr)}
                    aria-label={`${t('profile_address_edit')} ${addr.label}`}
                    className="min-h-10 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-ink hover:border-primary/40 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <EditIcon className="size-3.5" />
                    <span>{t('profile_address_edit')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(addr.id)}
                    aria-label={`${t('profile_address_delete')} ${addr.label}`}
                    className="min-h-10 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-orange-red-dark hover:border-orange-red/40 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <TrashIcon className="size-3.5" />
                    <span>{t('profile_address_delete')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function NotificationsView({ preferences, loading, error, onToggle, onReload }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-2">
        <Skeleton width="100%" height="56px" rounded="md" />
        <Skeleton width="100%" height="56px" rounded="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <ErrorState
          title={t('ui_error_default_title')}
          description={error}
          onRetry={onReload}
        />
      </div>
    );
  }

  const items = [
    { key: 'pickupUpdates', title: t('profile_notif_pickup'), desc: t('profile_notif_pickup_desc') },
    { key: 'reportStatus', title: t('profile_notif_report'), desc: t('profile_notif_report_desc') },
    { key: 'ngoNews', title: t('profile_notif_ngo'), desc: t('profile_notif_ngo_desc') },
  ];

  return (
    <section className={cn(CARD, 'max-w-xl mx-auto divide-y divide-border-light')}>
      {items.map(item => {
        const checked = Boolean(preferences[item.key]);
        return (
          <div
            key={item.key}
            className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink text-balance">{item.title}</p>
              <p className="text-xs text-muted text-pretty mt-0.5">{item.desc}</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={item.title}
              onClick={() => onToggle(item.key)}
              className={cn(
                'touch-target w-12 h-7 rounded-full transition-colors duration-150 p-1 flex items-center shrink-0 cursor-pointer',
                checked ? 'bg-primary justify-end' : 'bg-border justify-start'
              )}
            >
              <span className="size-5 rounded-full bg-white shadow-xs block" />
            </button>
          </div>
        );
      })}
    </section>
  );
}

export function DeleteAccountView({ onCancel, onDeletedSignOut }) {
  const { t } = useTranslation();
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return (
      <div className={cn(CARD, 'max-w-md mx-auto')}>
        <SuccessState
          title={t('profile_delete_success_title')}
          description={t('profile_delete_success_desc')}
          actionLabel={t('profile_delete_finish_btn')}
          onAction={onDeletedSignOut}
        />
      </div>
    );
  }

  return (
    <section
      role="alertdialog"
      aria-labelledby="delete-account-heading"
      aria-describedby="delete-account-desc"
      className={cn(CARD, 'max-w-md mx-auto space-y-5')}
    >
      <div className="size-11 rounded-lg bg-orange-red-light border border-orange-red/30 text-orange-red-dark flex items-center justify-center">
        <TrashIcon className="size-5" />
      </div>

      <div className="space-y-1.5">
        <h2 id="delete-account-heading" className="text-base font-bold text-ink text-balance">
          {t('profile_delete_warning_title')}
        </h2>
        <p id="delete-account-desc" className="text-xs text-muted text-pretty leading-relaxed">
          {t('profile_delete_warning_desc')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => setDeleted(true)}
          className="flex-1 min-h-11 py-2.5 px-4 rounded-lg bg-orange-red text-white text-xs font-bold hover:bg-orange-red-dark transition-colors duration-150 cursor-pointer"
        >
          {t('profile_delete_confirm_btn')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 py-2.5 px-5 rounded-lg border border-border bg-white text-xs font-semibold text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
        >
          {t('profile_cancel')}
        </button>
      </div>
    </section>
  );
}

export function AboutNgoView() {
  const { t } = useTranslation();

  return (
    <section className={cn(CARD, 'max-w-xl mx-auto space-y-4')}>
      <h2 className="text-base font-bold text-ink text-balance">{t('profile_row_about_title')}</h2>
      <p className="text-xs text-muted text-pretty leading-relaxed">{t('profile_about_mission')}</p>

      <div className="pt-3 border-t border-border-light space-y-1.5">
        <p className="text-xs font-bold text-ink">{t('profile_contact_label')}</p>
        <p className="text-xs text-muted">{t('profile_contact_email')}</p>
        <p className="font-mono-data text-xs text-muted">{t('profile_contact_phone')}</p>
        <p className="text-xs text-muted text-pretty">{t('profile_contact_office')}</p>
      </div>

      <div className="pt-3 border-t border-border-light">
        <p className="font-mono-data text-xs font-semibold text-muted">{t('profile_version_label')}</p>
      </div>
    </section>
  );
}

const LANGUAGES = [
  { code: 'en', label: 'English', disabled: false },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', disabled: false },
  { code: 'tcy', label: 'Tulu', disabled: true },
  { code: 'kok', label: 'Konkani', disabled: true },
  { code: 'bea', label: 'Beary', disabled: true },
];

export function LanguageSheet({ open, onClose }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelect = (lang) => {
    if (lang.disabled) return;
    i18n.changeLanguage(lang.code);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('profile_lang_sheet_title')}
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-sm bg-white rounded-t-xl md:rounded-xl border border-border shadow-modal p-5 space-y-4 animate-slide-up"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink text-balance">{t('profile_lang_sheet_title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('profile_cancel')}
            className="size-10 rounded-lg text-muted hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="divide-y divide-border-light">
          {LANGUAGES.map(lang => {
            const active = (i18n.language || 'en').startsWith(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                disabled={lang.disabled}
                onClick={() => handleSelect(lang)}
                className={cn(
                  'w-full min-h-12 py-3 flex items-center justify-between gap-3 text-left transition-colors duration-150',
                  lang.disabled
                    ? 'text-muted-light cursor-not-allowed'
                    : 'text-ink hover:text-primary cursor-pointer'
                )}
              >
                <span className={cn('text-sm', active ? 'font-bold text-primary' : 'font-medium')}>
                  {lang.label}
                </span>
                {lang.disabled ? (
                  <span className="px-2 py-0.5 rounded bg-sunken border border-border font-mono-data text-[10px] font-semibold text-muted">
                    {t('profile_lang_coming_soon')}
                  </span>
                ) : active ? (
                  <CheckCircleIcon className="size-4 text-primary shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SignOutConfirmDialog({ open, onConfirm, onCancel }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="signout-dialog-title"
        aria-describedby="signout-dialog-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-xl border border-border shadow-modal p-5 space-y-4 animate-scale-in"
      >
        <h2 id="signout-dialog-title" className="text-base font-bold text-ink text-balance">
          {t('profile_signout_confirm_title')}
        </h2>
        <p id="signout-dialog-desc" className="text-xs text-muted text-pretty leading-relaxed">
          {t('profile_signout_confirm_desc')}
        </p>
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-h-11 py-2.5 px-4 rounded-lg bg-orange-red text-white text-xs font-bold hover:bg-orange-red-dark transition-colors duration-150 cursor-pointer"
          >
            {t('signOut')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-11 py-2.5 px-4 rounded-lg border border-border bg-white text-xs font-semibold text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            {t('profile_cancel')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
