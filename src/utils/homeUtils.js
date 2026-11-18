import { CADENCE_OPTIONS } from '../data/mockBusinesses';
import { isActivePickupStatus } from './pickupStatusUtils';

// Device-submitted sample reports (same ids the Profile page treats as "mine").
const SEEDED_DEVICE_REPORT_IDS = new Set(['RPT-0002', 'RPT-0005', 'RPT-0006']);

const WINDOW_KEYS = { 'this-week': 'thisWeek', 'next-week': 'nextWeek' };
const STATUS_PRIORITY = { 'On the way': 3, Scheduled: 2, Requested: 1 };

/** i18n key for the time-of-day greeting. */
export function getGreetingKey(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'home_greeting_morning';
  if (hour < 17) return 'home_greeting_afternoon';
  return 'home_greeting_evening';
}

/** "Priya Shetty" -> "PS", "Ravi" -> "R", "" -> "?" */
export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Locale-aware short relative time, e.g. "2 hr. ago", "yesterday". */
export function formatTimeAgo(iso, locale = 'en', now = Date.now()) {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return '';
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' });
  const minutes = Math.round((target - now) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
}

/** Reports submitted from this device (new RP-* ids plus the sample ones). */
export function getMyReports(reports = []) {
  return reports.filter(r => String(r.id).startsWith('RP-') || SEEDED_DEVICE_REPORT_IDS.has(r.id));
}

/** Numbers for the contribution card. */
export function buildContributionSummary({ pickups = [], profile = null, reports = [], kgThisMonth = 0 }) {
  return {
    totalKg: Math.round(profile?.totalKgDiverted || 0),
    pickupsCompleted: pickups.filter(p => p.status === 'Completed').length,
    reportsMade: getMyReports(reports).length,
    kgThisMonth,
    points: profile?.points || 0,
  };
}

/** A user who has not contributed anything yet sees the "schedule your first pickup" state. */
export function isNewContributor(summary) {
  return summary.totalKg === 0 && summary.pickupsCompleted === 0;
}

/**
 * Upcoming collections for the Home list: active home pickups, the business subscription's next
 * pickup (when not paused) and any planned trash-bank drop-offs. Furthest-along status first,
 * then soonest date.
 */
export function buildUpcomingPickups({ pickups = [], business = null, dropOffs = [] }) {
  const items = [];

  pickups.forEach(p => {
    if (!isActivePickupStatus(p.status)) return;
    items.push({
      id: p.id,
      kind: 'home',
      status: p.status,
      date: p.date,
      detail: p.quantity,
      addressLine: p.locality || '',
      windowKey: WINDOW_KEYS[p.timeWindow] || null,
      windowParams: null,
    });
  });

  if (business && !business.isPaused && business.nextPickup) {
    const cadence = CADENCE_OPTIONS.find(c => c.id === business.cadence)?.label || '';
    items.push({
      id: `biz-${business.id || 'subscription'}`,
      kind: 'business',
      status: 'Scheduled',
      date: business.nextPickup,
      detail: business.name || '',
      addressLine: business.address || '',
      windowKey: cadence ? 'home_business_recurring' : null,
      windowParams: cadence ? { cadence } : null,
    });
  }

  dropOffs.forEach(d => {
    if (!isActivePickupStatus(d.status)) return;
    items.push({
      id: d.id,
      kind: 'trash-bank',
      status: d.status,
      date: d.date,
      detail: d.centerName || '',
      addressLine: d.address || d.area || '',
      windowKey: null,
      windowParams: null,
    });
  });

  items.sort(
    (a, b) =>
      (STATUS_PRIORITY[b.status] || 0) - (STATUS_PRIORITY[a.status] || 0) ||
      String(a.date).localeCompare(String(b.date))
  );
  return items;
}

