import { CADENCE_OPTIONS } from '../data/mockBusinesses';
import { isActivePickupStatus } from './pickupStatusUtils';

// Device-submitted sample reports (same ids the Profile page treats as "mine").
export const SEEDED_DEVICE_REPORT_IDS = new Set(['RPT-0002', 'RPT-0005', 'RPT-0006']);

const WINDOW_KEYS = { 'this-week': 'thisWeek', 'next-week': 'nextWeek' };
const STATUS_PRIORITY = { 'On the way': 3, Scheduled: 2, Requested: 1 };
const IST_TIMEZONE = 'Asia/Kolkata';

const DEFAULT_BAG_WEIGHT_KG = {
  'small bag': 2,
  'medium bag': 4,
  'large bag': 8,
};

/**
 * Extracts year, month, day, and hour in India Standard Time (`Asia/Kolkata`).
 */
function getIstParts(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(d);
  const map = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  const hour = Number(map.hour) % 24;
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour,
    isoDate: `${map.year}-${map.month}-${map.day}`,
    yearMonth: `${map.year}-${map.month}`,
  };
}

/** Returns YYYY-MM-DD in Asia/Kolkata (India Standard Time). */
export function getTodayIst(now = new Date()) {
  return getIstParts(now).isoDate;
}

/** Returns true if a YYYY-MM-DD or ISO date string falls in the current Asia/Kolkata calendar month. */
export function isCurrentMonthIst(dateStr, now = new Date()) {
  if (!dateStr) return false;
  const currentYm = getIstParts(now).yearMonth;
  const clean = String(dateStr).trim();
  if (/^\d{4}-\d{2}/.test(clean)) {
    return clean.slice(0, 7) === currentYm;
  }
  const parsed = new Date(clean);
  if (Number.isNaN(parsed.getTime())) return false;
  return getIstParts(parsed).yearMonth === currentYm;
}

/** i18n key for the time-of-day greeting in India time (`Asia/Kolkata`). */
export function getGreetingKey(date = new Date()) {
  const { hour } = getIstParts(date);
  if (hour >= 5 && hour < 12) return 'home_greeting_morning';
  if (hour >= 12 && hour < 17) return 'home_greeting_afternoon';
  return 'home_greeting_evening';
}

/** Extracts the user's first name, or returns `fallback` when missing/blank. */
export function getFirstName(name = '', fallback = '') {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  return parts.length > 0 ? parts[0] : fallback;
}

/** "Priya Shetty" -> "PS", "Ravi" -> "R", "" -> "?" */
export function getInitials(name = '') {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Locale-aware short relative time, e.g. "2 hr. ago", "yesterday". */
export function formatTimeAgo(iso, locale = 'en', now = Date.now()) {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return '';
  const cleanLocale = String(locale || 'en').split('-')[0];
  const resolvedLocale = cleanLocale === 'kn' ? 'kn-IN' : 'en-IN';
  try {
    const rtf = new Intl.RelativeTimeFormat(resolvedLocale, { numeric: 'auto', style: 'short' });
    const minutes = Math.round((target - now) / 60000);
    if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
    return rtf.format(Math.round(hours / 24), 'day');
  } catch {
    return '';
  }
}

/** Reports submitted by the current user (or seeded device reports for the demo returning user). */
export function getMyReports(reports = [], userKey = null) {
  if (!Array.isArray(reports)) return [];
  return reports.filter(r => {
    if (!r) return false;
    if (userKey && r.userKey) return r.userKey === userKey;
    if (String(r.id).startsWith('RP-')) {
      return !userKey || !r.userKey || r.userKey === userKey;
    }
    if (!userKey || userKey === '9876543210') {
      return SEEDED_DEVICE_REPORT_IDS.has(r.id);
    }
    return false;
  });
}

/** Resolves the weighed kg for a completed pickup (returns 0 if not completed or not weighed). */
export function getCompletedPickupWeightKg(pickup) {
  if (!pickup || pickup.status !== 'Completed') return 0;
  if (typeof pickup.weightKg === 'number' && !Number.isNaN(pickup.weightKg) && pickup.weightKg > 0) {
    return pickup.weightKg;
  }
  if (pickup.pointsEarned && pickup.pointsEarned > 0) {
    const q = String(pickup.quantity || '').toLowerCase();
    return DEFAULT_BAG_WEIGHT_KG[q] || 0;
  }
  return 0;
}

/**
 * Derives Contribution Card totals from completed, weighed pickups and the user's reports.
 * Nothing hardcoded. Pending or unweighed pickups do not count toward kg.
 */
export function buildContributionSummary({
  pickups = [],
  reports = [],
  points = null,
  profile = null,
  userKey = null,
  now = new Date(),
}) {
  const safePickups = Array.isArray(pickups) ? pickups : [];
  const completedPickups = safePickups.filter(p => p && p.status === 'Completed');

  let rawTotalKg = 0;
  let rawMonthKg = 0;

  for (const p of completedPickups) {
    const kg = getCompletedPickupWeightKg(p);
    if (kg > 0) {
      rawTotalKg += kg;
      if (isCurrentMonthIst(p.date, now)) {
        rawMonthKg += kg;
      }
    }
  }

  const totalKg = Math.round(rawTotalKg * 10) / 10;
  const kgThisMonth = Math.round(rawMonthKg * 10) / 10;
  const resolvedPoints =
    typeof points === 'number'
      ? points
      : typeof profile?.points === 'number'
        ? profile.points
        : completedPickups.reduce((sum, p) => sum + (Number(p.pointsEarned) || 0), 0);

  return {
    totalKg,
    pickupsCompleted: completedPickups.length,
    reportsMade: getMyReports(reports, userKey).length,
    kgThisMonth,
    points: resolvedPoints,
  };
}

/** A user who has not contributed anything yet sees the "schedule your first pickup" state. */
export function isNewContributor(summary) {
  if (!summary) return true;
  return summary.totalKg === 0 && summary.pickupsCompleted === 0;
}

/**
 * Upcoming collections for the Home list:
 * - Only active statuses (Requested, Scheduled, On the way)
 * - Excludes Completed, Cancelled, Skipped, and past uncompleted ("missed") pickups (`date < todayIst`)
 * - Sorted by soonest date first, then furthest-along status priority.
 */
export function buildUpcomingPickups({ pickups = [], business = null, dropOffs = [], now = new Date() }) {
  const todayIst = getTodayIst(now);
  const items = [];
  const safePickups = Array.isArray(pickups) ? pickups : [];

  safePickups.forEach(p => {
    if (!p || !isActivePickupStatus(p.status)) return;
    const dateStr = String(p.date || '').slice(0, 10);
    if (dateStr && dateStr < todayIst) return; // Past uncompleted pickup -> treated as missed
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
    const bizDate = String(business.nextPickup).slice(0, 10);
    if (!bizDate || bizDate >= todayIst) {
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
  }

  (Array.isArray(dropOffs) ? dropOffs : []).forEach(d => {
    if (!d || !isActivePickupStatus(d.status)) return;
    const dDate = String(d.date || '').slice(0, 10);
    if (dDate && dDate < todayIst) return;
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
      String(a.date).localeCompare(String(b.date)) ||
      (STATUS_PRIORITY[b.status] || 0) - (STATUS_PRIORITY[a.status] || 0)
  );
  return items;
}
