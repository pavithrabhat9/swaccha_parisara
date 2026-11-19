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
 * Reusable row inside a grouped Profile settings card:
 * Round light-green tinted icon, bold title (or orange-red for destructive), grey one-line subtitle, and chevron.
 */
function ProfileRow({ Icon, title, subtitle, onClick, destructive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[64px] px-4 py-3 flex items-center justify-between gap-3.5 text-left hover:bg-sunken/70 transition-colors cursor-pointer first:rounded-t-[20px] last:rounded-b-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span
          aria-hidden="true"
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            destructive ? 'bg-orange-red-light text-orange-red' : 'bg-primary-light text-primary'
          }`}
        >
          <Icon className="w-5 h-5" />
        </span>
        <div className="min-w-0 leading-snug">
          <p className={`text-sm font-bold truncate ${destructive ? 'text-orange-red' : 'text-black'}`}>
            {title}
          </p>
          <p className="text-xs text-muted truncate mt-0.5">{subtitle}</p>
        </div>
      </div>

      <ChevronRightIcon className="w-4 h-4 text-muted shrink-0" />
    </button>
  );
}

/**
 * ProfilePage — Settings-style Profile screen + sub-pages:
 * 1. PageTopBar (back arrow + centered title)
 * 2. Profile Card (round avatar with yellow badge, bold name, phone, Google email if applicable, pencil edit button)
 * 3. Grouped Sections: Account, General, Preference
 * 4. Full-width outlined Sign out button (with confirm dialog) + app version line + BottomMist
 * 5. Desktop (≥1024px): 2 columns (left sticky profile card + Sign out, right 3 grouped sections)
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

  const activeSection = searchParams.get('section'); // null | 'edit' | 'activity' | 'addresses' | 'notifications' | 'delete' | 'about'
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

  // === SUB-PAGES (rendered under the same PageTopBar with back arrow returning to Profile hub) ===
  if (activeSection && sectionTitles[activeSection]) {
    return (
      <div className="min-h-screen pb-16">
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
    <section className="rounded-[20px] bg-white shadow-card border border-border/60 p-5 flex items-center justify-between gap-3.5">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Round avatar with small yellow badge at bottom-right */}
        <div className="relative shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.name || 'User'}
              className="w-14 h-14 rounded-full object-cover border border-primary/20"
            />
          ) : (
            <span
              aria-hidden="true"
              className="w-14 h-14 rounded-full bg-primary text-white text-base font-extrabold flex items-center justify-center shadow-pill"
            >
              {getInitials(user?.name)}
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-yellow border-2 border-white flex items-center justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ink" />
          </span>
        </div>

        {/* Name, phone, and email (email shown only if signed in with Google) */}
        <div className="min-w-0 leading-snug">
          <h2 className="text-base font-extrabold text-black truncate">
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
        className="w-11 h-11 rounded-full bg-primary-light text-primary hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <EditIcon className="w-4 h-4" />
      </button>
    </section>
  );

  const signOutAndVersionElement = (
    <div className="space-y-3 pt-1">
      <button
        type="button"
        onClick={() => setSignOutConfirmOpen(true)}
        className="w-full min-h-[48px] py-3 px-5 rounded-[20px] border border-orange-red/40 bg-white hover:bg-orange-red-light/50 text-sm font-bold text-orange-red transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-red"
      >
        {t('signOut')}
      </button>
      <p className="text-center text-xs text-muted">
        {t('profile_version_label')}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pb-16">
      {/* 1. Shared PageTopBar */}
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
                className="px-1 text-xs font-bold text-muted uppercase tracking-wider"
              >
                {t('profile_group_account')}
              </h2>
              <div className="rounded-[20px] bg-white shadow-card border border-border/60 divide-y divide-border-light/70">
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
                className="px-1 text-xs font-bold text-muted uppercase tracking-wider"
              >
                {t('profile_group_general')}
              </h2>
              <div className="rounded-[20px] bg-white shadow-card border border-border/60 divide-y divide-border-light/70">
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
                className="px-1 text-xs font-bold text-muted uppercase tracking-wider"
              >
                {t('profile_group_preference')}
              </h2>
              <div className="rounded-[20px] bg-white shadow-card border border-border/60 divide-y divide-border-light/70">
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
