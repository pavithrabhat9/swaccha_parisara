import i18n from '../i18n';

export function getNextPickupDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

function resolveLocaleTag(locale) {
  const raw = locale || i18n?.resolvedLanguage || i18n?.language || 'en-IN';
  const lang = String(raw).split('-')[0].toLowerCase();
  if (lang === 'kn') return 'kn-IN';
  return 'en-IN';
}

/**
 * Formats a date string ("2026-11-22" or ISO) using Intl.DateTimeFormat
 * for the active language ('en-IN' or 'kn-IN') in Asia/Kolkata timezone.
 */
export function formatShortDate(value, locale) {
  if (!value) return '';
  const str = String(value).trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(str) ? new Date(`${str}T00:00:00+05:30`) : new Date(str);
  if (Number.isNaN(d.getTime())) return '';
  const tag = resolveLocaleTag(locale);
  try {
    return new Intl.DateTimeFormat(tag, {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
