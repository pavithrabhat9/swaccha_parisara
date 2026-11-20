import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { usePickups } from '../hooks/usePickups';
import { useAddresses } from '../hooks/useAddresses';
import { useBusinessSubscription } from '../hooks/useBusinessSubscription';
import { useProfilePreferences } from '../hooks/useProfilePreferences';
import { useToast } from '../components/ui/Toast';
import PageTopBar from '../components/layout/PageTopBar';
import BottomMist from '../components/layout/BottomMist';
import {
  EditProfileView,
  MyActivityView,
  AddressListView,
  NotificationsView,
  DeleteAccountView,
  AboutNgoView,
  LanguageSheet,
  SignOutConfirmDialog,
} from '../components/profile/ProfileSubPages';
import { getInitials, getMyReports } from '../utils/homeUtils';
import { cn } from '../utils/cn';
import {
  EditIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  BellIcon,
  LockIcon,
  TrashIcon,
  GlobeIcon,
  BookIcon,
  LeafIcon,
  TruckIcon,
} from '../components/ui/Icons';

/**
 * Reusable row inside a grouped Profile settings card.
 */
function ProfileRow({ Icon, title, subtitle, onClick, destructive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-16 px-4 py-3 flex items-center justify-between gap-3.5 text-left hover:bg-sunken/70 transition-colors duration-150 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span
          aria-hidden="true"
          className={cn(
            'size-10 rounded-full flex items-center justify-center shrink-0',
            destructive ? 'bg-orange-red-light text-orange-red-dark' : 'bg-primary-light text-primary'
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 leading-snug">
          <p className={cn('text-sm font-bold truncate', destructive ? 'text-orange-red-dark' : 'text-ink')}>
            {title}
          </p>
          <p className="text-xs text-muted truncate mt-0.5">{subtitle}</p>
        </div>
      </div>

      <ChevronRightIcon className="size-4 text-muted shrink-0" />
    </button>
  );
}

/**
 * ProfilePage — Settings-style Profile screen + sub-pages.
 */
export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const { user, updateProfile, logout } = useAuth();
  const { reports, loading: reportsLoading } = useReports();
  const { pickups, loading: pickupsLoading } = usePickups();
  const { business } = useBusinessSubscription();
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

  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  const activeSection = searchParams.get('section');
  const openSection = (sec) => setSearchParams(sec ? { section: sec } : {});

  const myReports = useMemo(() => getMyReports(reports), [reports]);

  const currentLanguageLabel = (i18n.language || 'en').startsWith('kn')
    ? 'ಕನ್ನಡ (Kannada)'
    : 'English';

  const businessSubtitle = business
    ? business.isPaused
      ? `${business.name} · ${t('profile_business_paused')}`
      : `${business.name} · ${t('profile_business_next_pickup', { date: business.nextPickup })}`
    : t('profile_row_business_sub');

  const sectionTitles = {
    edit: t('profile_edit_page_title'),
    activity: t('profile_row_activity_title'),
    addresses: t('profile_row_addresses_title'),
    notifications: t('profile_row_notifications_title'),
    delete: t('profile_delete_page_title'),
    about: t('profile_row_about_title'),
  };

  // === SUB-PAGES ===
  if (activeSection && sectionTitles[activeSection]) {
    return (
      <div className="min-h-dvh pb-16">
        <PageTopBar
          title={sectionTitles[activeSection]}
          onBack={() => openSection(null)}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {activeSection === 'edit' && (
            <EditProfileView
              user={user}
              onCancel={() => openSection(null)}
              onSave={async (updates) => {
                const res = await updateProfile(updates);
                if (res.success) {
                  showToast(t('profile_updated_toast'), 'success', 2500);
                  openSection(null);
                }
                return res;
              }}
            />
          )}

          {activeSection === 'activity' && (
            <MyActivityView
              pickups={pickups}
              pickupsLoading={pickupsLoading}
              reports={myReports}
              reportsLoading={reportsLoading}
            />
          )}

          {activeSection === 'addresses' && (
            <AddressListView
              addresses={addresses}
              loading={addressesLoading}
              error={addressesError}
              onReload={reloadAddresses}
              defaultLocality={user?.locality || 'Kadri'}
              onAdd={async (data) => {
                await addAddress(data);
                showToast(t('profile_address_saved_toast'), 'success', 2500);
              }}
              onUpdate={async (id, data) => {
                await updateAddress(id, data);
                showToast(t('profile_address_saved_toast'), 'success', 2500);
              }}
              onDelete={async (id) => {
                await deleteAddress(id);
                showToast(t('profile_address_deleted_toast'), 'success', 2500);
              }}
              onSetDefault={async (id) => {
                await setDefaultAddress(id);
                showToast(t('profile_address_default_toast'), 'success', 2500);
              }}
            />
          )}

          {activeSection === 'notifications' && (
            <NotificationsView
              preferences={preferences}
              loading={prefsLoading}
              error={prefsError}
              onToggle={togglePreference}
              onReload={reloadPreferences}
            />
          )}

          {activeSection === 'delete' && (
            <DeleteAccountView
              onCancel={() => openSection(null)}
              onDeletedSignOut={() => {
                openSection(null);
                logout();
              }}
            />
          )}

          {activeSection === 'about' && <AboutNgoView />}
        </div>

        <BottomMist />
      </div>
    );
  }

  // === MAIN PROFILE HUB ===
  const profileCardElement = (
    <section className="rounded-2xl bg-white border border-border p-5 flex items-center justify-between gap-3.5">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Round avatar with small yellow badge at bottom-right */}
        <div className="relative shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.name || 'User'}
              className="size-14 rounded-full object-cover border border-primary/20"
            />
          ) : (
            <span
              aria-hidden="true"
              className="size-14 rounded-full bg-primary text-white text-base font-extrabold flex items-center justify-center"
            >
              {getInitials(user?.name)}
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-yellow border-2 border-white flex items-center justify-center"
          >
            <span className="size-1.5 rounded-full bg-ink" />
          </span>
        </div>

        {/* Name, phone, and email */}
        <div className="min-w-0 leading-snug">
          <h2 className="text-base font-extrabold text-ink text-balance truncate">
            {user?.name || 'Resident'}
          </h2>
          {user?.phone && (
            <p className="text-xs text-muted tabular truncate mt-0.5">
              +91 {user.phone}
            </p>
          )}
          {user?.provider === 'google' && (
            <p className="text-xs text-muted truncate mt-0.5">
              {user?.email || 'citizen.sample@example.com'}
            </p>
          )}
        </div>
      </div>

      {/* Pencil button on the right -> opens Edit profile sub-page */}
      <button
        type="button"
        onClick={() => openSection('edit')}
        aria-label={t('profile_edit_aria')}
        className="size-11 rounded-full bg-primary-light text-primary hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <EditIcon className="size-4" />
      </button>
    </section>
  );

  const signOutAndVersionElement = (
    <div className="space-y-3 pt-1">
      <button
        type="button"
        onClick={() => setSignOutConfirmOpen(true)}
        className="w-full min-h-12 py-3 px-5 rounded-2xl border border-orange-red/40 bg-white hover:bg-orange-red-light/50 text-sm font-bold text-orange-red-dark transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-red"
      >
        {t('signOut')}
      </button>
      <p className="text-center text-xs text-muted tabular">
        {t('profile_version_label')}
      </p>
    </div>
  );

  return (
    <div className="min-h-dvh pb-16">
      <PageTopBar title={t('profile_title')} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* LEFT COLUMN (sticky on desktop ≥1024px): Profile Card + Sign Out */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            {profileCardElement}
            <div className="hidden lg:block">{signOutAndVersionElement}</div>
          </div>

          {/* RIGHT COLUMN: Grouped Sections (Account, General, Preference) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Group 1: Account */}
            <section aria-labelledby="profile-group-account" className="space-y-2">
              <h2
                id="profile-group-account"
                className="px-1 text-xs font-bold text-ink text-balance"
              >
                {t('profile_group_account')}
              </h2>
              <div className="rounded-2xl bg-white border border-border divide-y divide-border-light">
                <ProfileRow
                  Icon={ClockIcon}
                  title={t('profile_row_activity_title')}
                  subtitle={t('profile_row_activity_sub')}
                  onClick={() => openSection('activity')}
                />
                <ProfileRow
                  Icon={MapPinIcon}
                  title={t('profile_row_addresses_title')}
                  subtitle={t('profile_row_addresses_sub')}
                  onClick={() => openSection('addresses')}
                />
                <ProfileRow
                  Icon={TruckIcon}
                  title={t('profile_row_business_title')}
                  subtitle={businessSubtitle}
                  onClick={() => navigate('/business')}
                />
              </div>
            </section>

            {/* Group 2: General */}
            <section aria-labelledby="profile-group-general" className="space-y-2">
              <h2
                id="profile-group-general"
                className="px-1 text-xs font-bold text-ink text-balance"
              >
                {t('profile_group_general')}
              </h2>
              <div className="rounded-2xl bg-white border border-border divide-y divide-border-light">
                <ProfileRow
                  Icon={BellIcon}
                  title={t('profile_row_notifications_title')}
                  subtitle={t('profile_row_notifications_sub')}
                  onClick={() => openSection('notifications')}
                />
                <ProfileRow
                  Icon={LockIcon}
                  title={t('profile_row_privacy_title')}
                  subtitle={t('profile_row_privacy_sub')}
                  onClick={() => navigate('/privacy')}
                />
                <ProfileRow
                  Icon={TrashIcon}
                  title={t('profile_row_delete_title')}
                  subtitle={t('profile_row_delete_sub')}
                  destructive
                  onClick={() => openSection('delete')}
                />
              </div>
            </section>

            {/* Group 3: Preference */}
            <section aria-labelledby="profile-group-preference" className="space-y-2">
              <h2
                id="profile-group-preference"
                className="px-1 text-xs font-bold text-ink text-balance"
              >
                {t('profile_group_preference')}
              </h2>
              <div className="rounded-2xl bg-white border border-border divide-y divide-border-light">
                <ProfileRow
                  Icon={GlobeIcon}
                  title={t('profile_row_language_title')}
                  subtitle={currentLanguageLabel}
                  onClick={() => setLangSheetOpen(true)}
                />
                <ProfileRow
                  Icon={BookIcon}
                  title={t('profile_row_terms_title')}
                  subtitle={t('profile_row_terms_sub')}
                  onClick={() => navigate('/terms')}
                />
                <ProfileRow
                  Icon={LeafIcon}
                  title={t('profile_row_about_title')}
                  subtitle={t('profile_row_about_sub')}
                  onClick={() => openSection('about')}
                />
              </div>
            </section>

            {/* Mobile/Tablet bottom Sign out + version */}
            <div className="lg:hidden">{signOutAndVersionElement}</div>
          </div>
        </div>
      </div>

      {/* Language Selection Sheet */}
      <LanguageSheet open={langSheetOpen} onClose={() => setLangSheetOpen(false)} />

      {/* Sign Out Confirmation Dialog */}
      <SignOutConfirmDialog
        open={signOutConfirmOpen}
        onCancel={() => setSignOutConfirmOpen(false)}
        onConfirm={() => {
          setSignOutConfirmOpen(false);
          logout();
        }}
      />

      {/* Bottom mist fade above the mobile bottom bar */}
      <BottomMist />
    </div>
  );
}
