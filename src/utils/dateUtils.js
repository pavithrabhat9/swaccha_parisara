export function getNextPickupDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

/** "2026-07-21" -> "21 Jul 2026". Returns '' for invalid input. */
export function formatShortDate(value, locale = 'en-IN') {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
