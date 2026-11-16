import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { usePickups } from '../hooks/usePickups';
import { useAddresses } from '../hooks/useAddresses';
import { useProfilePreferences } from '../hooks/useProfilePreferences';
import { useToast } from '../components/ui/Toast';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { DK_LOCALITIES } from '../data/mockPickups';
import { formatShortDate } from '../utils/dateUtils';
import {
  EditIcon,
  MapPinIcon,
  UserIcon,
  TrashIcon,
  ChevronRightIcon,
} from '../components/ui/Icons';

// Seeded device report IDs so all 3 statuses (Reported, Being Reviewed, Cleared) are visible alongside new RP-* reports
const SEEDED_DEVICE_REPORT_IDS = new Set(['RPT-0002', 'RPT-0005', 'RPT-0006']);

/**
 * ProfilePage — Stage 6:
 * 1. Account card: name, phone, locality, edit (mock)
 * 2. My activity: timeline of reports and pickups
 * 3. My reports: list with photo thumbnail, waste type, date and status chip (Reported, Being Reviewed, Cleared)
 * 4. Addresses: list, add, edit, delete, set default (locality dropdown)
 * 5. Notification toggles (pickup updates, report status, NGO news), saved through a service
 * 6. Privacy Policy & Terms of Service pages + About the NGO (placeholder contacts), app version, Sign out
 * (No Payment section and no Security section.)
 */
export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { user, updateProfile, logout } = useAuth();
  const { reports, loading: reportsLoading } = useReports();
  const { pickups, loading: pickupsLoading } = usePickups();
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    reloadAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();
  const {
    preferences,
    loading: prefsLoading,
    error: prefsError,
    togglePreference,
    reloadPreferences,
  } = useProfilePreferences();

  // Edit account state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocality, setEditLocality] = useState('');
  const [editError, setEditError] = useState('');

  // Address form state (add / edit)
  const [addressFormMode, setAddressFormMode] = useState(null); // null | 'add' | addressId
  const [addrLabel, setAddrLabel] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrLocality, setAddrLocality] = useState(DK_LOCALITIES[0]);

  const startEditingAccount = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditLocality(user?.locality || DK_LOCALITIES[0]);
    setEditError('');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    const result = await updateProfile({
      name: editName,
      phone: editPhone,
      locality: editLocality,
    });
    if (!result.success) {
      setEditError(t(result.error));
      return;
    }
    setIsEditing(false);
    showToast(t('profile_updated_toast'), 'success', 2500);
  };

  const openAddAddress = () => {
    setAddrLabel('');
    setAddrLine('');
    setAddrLocality(user?.locality || DK_LOCALITIES[0]);
    setAddressFormMode('add');
  };

  const openEditAddress = (addr) => {
    setAddrLabel(addr.label);
    setAddrLine(addr.line);
    setAddrLocality(addr.locality || DK_LOCALITIES[0]);
    setAddressFormMode(addr.id);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addrLine.trim()) return;
    if (addressFormMode === 'add') {
      await addAddress({ label: addrLabel || 'Address', line: addrLine, locality: addrLocality });
    } else if (addressFormMode) {
      await updateAddress(addressFormMode, {
        label: addrLabel || 'Address',
        line: addrLine,
        locality: addrLocality,
      });
    }
    setAddressFormMode(null);
    showToast(t('profile_address_saved_toast'), 'success', 2500);
  };

  const handleDeleteAddress = async (id) => {
    await deleteAddress(id);
    showToast(t('profile_address_deleted_toast'), 'success', 2500);
  };

  const handleSetDefaultAddress = async (id) => {
    await setDefaultAddress(id);
    showToast(t('profile_address_default_toast'), 'success', 2500);
  };

  // Device-submitted reports
  const myReports = useMemo(() => {
    return (reports || []).filter(
      r => String(r.id).startsWith('RP-') || SEEDED_DEVICE_REPORT_IDS.has(r.id)
    );
  }, [reports]);

  // Unified chronological activity timeline (reports + pickups)
  const activityItems = useMemo(() => {
    const reportEvents = myReports.map(r => ({
      id: `act-rep-${r.id}`,
      kind: 'report',
      date: r.createdAt ? r.createdAt.split('T')[0] : '2026-07-01',
      title: t('profile_activity_report_label', { type: r.wasteType }),
      subtitle: r.placeName,
      status: r.status,
    }));

    const pickupEvents = (pickups || []).slice(0, 5).map(p => ({
      id: `act-pu-${p.id}`,
      kind: 'pickup',
      date: p.date,
      title: t('profile_activity_pickup_label', { bag: p.quantity }),
      subtitle: p.locality || 'Kadri',
      status: p.status,
    }));

    return [...pickupEvents, ...reportEvents].sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );
  }, [myReports, pickups, t]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Page Title + Sign Out */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-black tracking-tight">{t('profile_title')}</h1>
        <button
          type="button"
          onClick={logout}
          className="touch-target px-3 py-1.5 text-xs font-semibold text-orange-red hover:text-orange-red-dark transition-colors cursor-pointer"
        >
          {t('signOut')}
        </button>
      </div>

      {/* ====================================================
          1. ACCOUNT CARD
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            {t('profile_account_title')}
          </h2>
          {!isEditing && (
            <button
              type="button"
              onClick={startEditingAccount}
              className="touch-target px-3 py-1.5 rounded-[6px] border border-border text-xs font-semibold text-black hover:border-black/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <EditIcon className="w-3.5 h-3.5" />
              <span>{t('profile_edit')}</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                {t('yourName')}
              </label>
              <input
                id="profile-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-[6px] text-sm bg-white text-black focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="profile-phone" className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                {t('phoneNumber')}
              </label>
              <input
                id="profile-phone"
                type="tel"
                maxLength={10}
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-3.5 py-2.5 border border-border rounded-[6px] text-sm bg-white text-black focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="profile-locality" className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                {t('locality')}
              </label>
              <select
                id="profile-locality"
                value={editLocality}
                onChange={(e) => setEditLocality(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-[6px] text-sm bg-white text-black focus:outline-none focus:border-primary cursor-pointer"
              >
                {DK_LOCALITIES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {editError && (
              <p className="text-xs font-medium text-orange-red">{editError}</p>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                className="touch-target px-4 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {t('profile_save')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="touch-target px-4 py-2.5 rounded-[6px] border border-border text-xs font-semibold text-muted hover:text-black transition-colors cursor-pointer"
              >
                {t('profile_cancel')}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-[8px] border border-border bg-sunken flex items-center justify-center text-primary shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-base font-bold text-black truncate">
                {user?.name || 'Resident'}
              </p>
              <p className="text-xs text-muted tabular">
                {user?.phone ? `+91 ${user.phone}` : 'Google Account (Sample)'}
              </p>
              <p className="text-xs text-muted inline-flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{user?.locality || 'Kadri'}</span>
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ====================================================
          2. MY ACTIVITY (Timeline of reports and pickups)
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            {t('profile_activity_title')}
          </h2>
          <p className="text-xs text-muted mt-0.5">{t('profile_activity_subtitle')}</p>
        </div>

        {reportsLoading || pickupsLoading ? (
          <SkeletonCard />
        ) : activityItems.length === 0 ? (
          <EmptyState title={t('profile_activity_empty')} />
        ) : (
          <ol className="relative border-l-2 border-border ml-2.5 space-y-4">
            {activityItems.slice(0, 6).map(item => (
              <li key={item.id} className="pl-4 relative flex items-start justify-between gap-3">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    item.kind === 'pickup' ? 'bg-primary' : 'bg-yellow'
                  }`}
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-black truncate">{item.title}</p>
                  <p className="text-[11px] text-muted">
                    {item.subtitle} · {formatShortDate(item.date)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ====================================================
          3. MY REPORTS (with photo thumbnail, waste type, date & status chip)
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            {t('profile_my_reports_title')}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {t('profile_my_reports_subtitle')}
          </p>
        </div>

        {reportsLoading ? (
          <div className="space-y-3">
            <SkeletonCard />
          </div>
        ) : myReports.length === 0 ? (
          <EmptyState
            title={t('profile_no_reports_title')}
            description={t('profile_no_reports_desc')}
            actionLabel={t('profile_report_plastic')}
            onAction={() => navigate('/map')}
          />
        ) : (
          <div className="divide-y divide-border">
            {myReports.map(report => (
              <div
                key={report.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={report.photoUrl}
                    alt={report.wasteType}
                    className="w-12 h-12 rounded-[6px] object-cover bg-sunken border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black truncate">
                      {report.wasteType}
                    </p>
                    <p className="text-xs text-muted truncate mt-0.5">
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

      {/* ====================================================
          4. ADDRESSES (list, add, edit, delete, set default with locality dropdown)
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              {t('profile_addresses_title')}
            </h2>
            <p className="text-xs text-muted mt-0.5">{t('profile_addresses_subtitle')}</p>
          </div>
          {!addressFormMode && (
            <button
              type="button"
              onClick={openAddAddress}
              className="touch-target px-3 py-1.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer shrink-0"
            >
              {t('profile_address_add')}
            </button>
          )}
        </div>

        {addressesLoading ? (
          <Skeleton width="100%" height="72px" rounded="sm" />
        ) : addressesError ? (
          <ErrorState
            title={t('ui_error_default_title')}
            description={addressesError}
            onRetry={reloadAddresses}
          />
        ) : (
          <>
            {addressFormMode && (
              <form
                onSubmit={handleSaveAddress}
                className="p-4 rounded-[6px] border border-border bg-sunken space-y-3"
              >
                <div>
                  <label htmlFor="addr-label" className="block text-[11px] font-semibold text-muted mb-1 uppercase tracking-wider">
                    {t('profile_address_label_field')}
                  </label>
                  <input
                    id="addr-label"
                    type="text"
                    value={addrLabel}
                    onChange={e => setAddrLabel(e.target.value)}
                    placeholder="Home"
                    className="w-full px-3 py-2 border border-border rounded-[6px] text-xs bg-white text-black focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="addr-line" className="block text-[11px] font-semibold text-muted mb-1 uppercase tracking-wider">
                    {t('profile_address_line_field')}
                  </label>
                  <input
                    id="addr-line"
                    type="text"
                    required
                    value={addrLine}
                    onChange={e => setAddrLine(e.target.value)}
                    placeholder="Flat / Street / Landmark"
                    className="w-full px-3 py-2 border border-border rounded-[6px] text-xs bg-white text-black focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="addr-locality" className="block text-[11px] font-semibold text-muted mb-1 uppercase tracking-wider">
                    {t('locality')}
                  </label>
                  <select
                    id="addr-locality"
                    value={addrLocality}
                    onChange={e => setAddrLocality(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-[6px] text-xs bg-white text-black focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {DK_LOCALITIES.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark cursor-pointer"
                  >
                    {t('profile_save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressFormMode(null)}
                    className="min-h-[40px] px-4 py-2 rounded-[6px] border border-border bg-white text-xs font-semibold text-muted hover:text-black cursor-pointer"
                  >
                    {t('profile_cancel')}
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-border">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-black">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-[4px] bg-primary-light text-primary-dark text-[10px] font-bold">
                          {t('profile_address_default_badge')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">
                      {addr.line} · <span className="font-medium text-black">{addr.locality}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="min-h-[36px] px-2.5 py-1 rounded-[6px] border border-border text-[11px] font-semibold text-primary hover:border-primary cursor-pointer"
                      >
                        {t('profile_address_set_default')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditAddress(addr)}
                      aria-label={`${t('profile_address_edit')} ${addr.label}`}
                      className="min-h-[36px] px-2.5 py-1 rounded-[6px] border border-border text-[11px] font-semibold text-black hover:border-black/30 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                      <span>{t('profile_address_edit')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label={`${t('profile_address_delete')} ${addr.label}`}
                      className="min-h-[36px] px-2.5 py-1 rounded-[6px] border border-border text-[11px] font-semibold text-orange-red hover:border-orange-red/40 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>{t('profile_address_delete')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ====================================================
          5. NOTIFICATION PREFERENCES (3 mock toggles saved via service)
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          {t('profile_notifications_title')}
        </h2>

        {prefsLoading ? (
          <div className="space-y-2">
            <Skeleton width="100%" height="44px" rounded="sm" />
            <Skeleton width="100%" height="44px" rounded="sm" />
          </div>
        ) : prefsError ? (
          <ErrorState
            title={t('ui_error_default_title')}
            description={prefsError}
            onRetry={reloadPreferences}
          />
        ) : (
          <div className="divide-y divide-border">
            {[
              {
                key: 'pickupUpdates',
                title: t('profile_notif_pickup'),
                desc: t('profile_notif_pickup_desc'),
              },
              {
                key: 'reportStatus',
                title: t('profile_notif_report'),
                desc: t('profile_notif_report_desc'),
              },
              {
                key: 'ngoNews',
                title: t('profile_notif_ngo'),
                desc: t('profile_notif_ngo_desc'),
              },
            ].map(item => {
              const checked = Boolean(preferences[item.key]);
              return (
                <div
                  key={item.key}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black">{item.title}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={item.title}
                    onClick={() => togglePreference(item.key)}
                    className={`touch-target w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 cursor-pointer ${
                      checked ? 'bg-primary justify-end' : 'bg-border justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs block" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ====================================================
          6. PRIVACY POLICY, TERMS OF SERVICE & ABOUT THE NGO
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          {t('profile_about_title')}
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          {t('profile_about_mission')}
        </p>

        {/* Placeholder Contact Details (clearly marked) */}
        <div className="pt-3 border-t border-border-light space-y-1">
          <p className="text-[11px] font-semibold text-black uppercase tracking-wider">
            {t('profile_contact_label')}
          </p>
          <p className="text-xs text-muted">{t('profile_contact_email')}</p>
          <p className="text-xs text-muted">{t('profile_contact_phone')}</p>
          <p className="text-xs text-muted">{t('profile_contact_office')}</p>
        </div>

        {/* Legal page links (Privacy Policy & Terms of Service) */}
        <div className="pt-3 border-t border-border-light divide-y divide-border-light">
          <button
            type="button"
            onClick={() => navigate('/privacy')}
            className="w-full min-h-[44px] py-2 flex items-center justify-between text-xs font-semibold text-black hover:text-primary cursor-pointer"
          >
            <span>{t('profile_legal_privacy_link')}</span>
            <ChevronRightIcon className="w-4 h-4 text-muted" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/terms')}
            className="w-full min-h-[44px] py-2 flex items-center justify-between text-xs font-semibold text-black hover:text-primary cursor-pointer"
          >
            <span>{t('profile_legal_terms_link')}</span>
            <ChevronRightIcon className="w-4 h-4 text-muted" />
          </button>
        </div>

        {/* App version + Sign out */}
        <div className="pt-3 border-t border-border-light flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold text-muted">
            {t('profile_version_label')}
          </p>
          <button
            type="button"
            onClick={logout}
            className="touch-target px-3 py-1.5 text-xs font-semibold text-orange-red hover:text-orange-red-dark transition-colors cursor-pointer"
          >
            {t('signOut')}
          </button>
        </div>
      </section>
    </div>
  );
}
