import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { useBusinessSubscription } from '../hooks/useBusinessSubscription';
import { useProfilePreferences } from '../hooks/useProfilePreferences';
import { useToast } from '../components/ui/Toast';
import LoginFlow from '../components/auth/LoginFlow';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { DK_LOCALITIES } from '../data/mockPickups';
import { EditIcon, MapPinIcon, CalendarIcon, UserIcon } from '../components/ui/Icons';

// Default device-submitted report IDs from mock data (so all 3 statuses are represented alongside new RP-* reports)
const SEEDED_DEVICE_REPORT_IDS = new Set(['RPT-0002', 'RPT-0005', 'RPT-0006']);

/**
 * ProfilePage — Account management, My Reports, Business link/status,
 * Notification Preferences, About the NGO, and Privacy/Version info.
 */
export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const authHook = useAuth();
  const { isLoggedIn, user, updateProfile, logout } = authHook;

  const { reports, loading: reportsLoading } = useReports();
  const { business, loading: businessLoading } = useBusinessSubscription();
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

  const startEditing = () => {
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
      setEditError(result.error);
      return;
    }
    setIsEditing(false);
    showToast(t('profile_updated_toast'), 'success', 2500);
  };

  // Reports submitted from this device (new RP-* reports + 3 seeded device reports)
  const myReports = useMemo(() => {
    return (reports || []).filter(
      r => String(r.id).startsWith('RP-') || SEEDED_DEVICE_REPORT_IDS.has(r.id)
    );
  }, [reports]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Page Title + Sign Out button */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-black tracking-tight">{t('profile_title')}</h1>
        {isLoggedIn && (
          <button
            type="button"
            onClick={logout}
            className="touch-target px-3 py-1.5 text-xs font-semibold text-orange-red hover:text-orange-red-dark transition-colors cursor-pointer"
          >
            {t('signOut')}
          </button>
        )}
      </div>

      {/* ====================================================
          1. ACCOUNT CARD
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            {t('profile_account_title')}
          </h2>
          {isLoggedIn && !isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="touch-target px-3 py-1.5 rounded-[6px] border border-border text-xs font-semibold text-black hover:border-black/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <EditIcon className="w-3.5 h-3.5" />
              <span>{t('profile_edit')}</span>
            </button>
          )}
        </div>

        {!isLoggedIn ? (
          <LoginFlow authHook={authHook} />
        ) : isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                {t('yourName')}
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-[6px] text-sm bg-white text-black focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                maxLength={10}
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-3.5 py-2.5 border border-border rounded-[6px] text-sm bg-white text-black focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                {t('locality')}
              </label>
              <select
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
                +91 {user?.phone || '9876543210'}
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
          2. MY REPORTS (submitted from this device)
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
            <SkeletonCard />
          </div>
        ) : myReports.length === 0 ? (
          <EmptyState
            title={t('profile_no_reports_title')}
            description={t('profile_no_reports_desc')}
            actionLabel={t('profile_report_plastic')}
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="divide-y divide-border">
            {myReports.map(report => {
              const formattedDate = report.createdAt
                ? new Date(report.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : `${report.daysSinceFirst || 0} ${t('daysAgo')}`;

              return (
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
                        {report.placeName} · {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ====================================================
          3. FOR BUSINESSES (status card if subscribed, otherwise link)
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              {t('profile_business_title')}
            </h2>

            {businessLoading ? (
              <Skeleton width="220px" height="18px" rounded="sm" />
            ) : business ? (
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-black">{business.name}</p>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border ${
                      business.isPaused
                        ? 'bg-yellow-light text-yellow-dark border-yellow/30'
                        : 'bg-primary-light text-primary-dark border-primary/20'
                    }`}
                  >
                    {business.isPaused ? t('profile_business_paused') : t('profile_business_active')}
                  </span>
                </div>
                <p className="text-xs text-muted inline-flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    {t('profile_business_next_pickup', { date: business.nextPickup })}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted leading-relaxed">
                {t('profile_business_desc')}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/business')}
            className="touch-target px-4 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shrink-0 cursor-pointer"
          >
            {business ? t('profile_business_manage') : t('profile_business_cta')}
          </button>
        </div>
      </section>

      {/* ====================================================
          4. NOTIFICATION PREFERENCES (3 mock toggles saved in localStorage via service)
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
          5. ABOUT THE NGO (mission + clearly marked placeholder contact details)
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-3">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          {t('profile_about_title')}
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          {t('profile_about_mission')}
        </p>

        <div className="pt-3 border-t border-border-light space-y-1">
          <p className="text-[11px] font-semibold text-black uppercase tracking-wider">
            {t('profile_contact_label')}
          </p>
          <p className="text-xs text-muted">{t('profile_contact_email')}</p>
          <p className="text-xs text-muted">{t('profile_contact_phone')}</p>
          <p className="text-xs text-muted">{t('profile_contact_office')}</p>
        </div>
      </section>

      {/* ====================================================
          6. PRIVACY AND APP VERSION
          ==================================================== */}
      <section className="border border-border rounded-[8px] bg-white p-5 space-y-2">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          {t('profile_privacy_title')}
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          {t('profile_privacy_text')}
        </p>
        <p className="text-[11px] font-semibold text-muted pt-1">
          {t('profile_version_label')}
        </p>
      </section>
    </div>
  );
}

