/**
 * Pure domain helpers for the "Know Your Plastic" (/learn/plastic-types) guide.
 */

export const PLASTIC_FILTER_OPTIONS = [
  { id: 'all', labelKey: 'kyp_filter_all' },
  { id: 'recyclable', labelKey: 'kyp_status_widely' },
  { id: 'special', labelKey: 'kyp_status_sometimes' },
  { id: 'not_recyclable', labelKey: 'kyp_status_rarely' },
];

const ABBR_TO_CODE = {
  pet: 1,
  pete: 1,
  hdpe: 2,
  pvc: 3,
  v: 3,
  ldpe: 4,
  pp: 5,
  ps: 6,
  other: 7,
};

/**
 * Resolves a URL query param or hash fragment (e.g. "1", "#2", "pet", "HDPE", "#resin-5")
 * into a resin code number 1..7, or null if invalid.
 */
export function normalizePlasticCodeParam(raw) {
  if (raw === null || raw === undefined) return null;
  const cleaned = String(raw).trim().toLowerCase().replace(/^#/, '').replace(/^resin-/, '');
  if (!cleaned) return null;

  if (/^[1-7]$/.test(cleaned)) {
    return Number(cleaned);
  }
  return ABBR_TO_CODE[cleaned] || null;
}

/**
 * Normalizes a plastic item's recyclability token into the 3 article statuses:
 * 'widely' | 'sometimes' | 'rarely'.
 */
export function getRecyclabilityStatus(value) {
  const v = String(value || '').toLowerCase();
  if (v === 'widely' || v === 'yes') return 'widely';
  if (v === 'sometimes' || v === 'limited') return 'sometimes';
  return 'rarely';
}

/**
 * Normalizes a plastic item's status or legacy `recyclable` value into one of
 * the 3 filter categories: 'recyclable' | 'special' | 'not_recyclable'.
 */
export function getPlasticCategory(value) {
  const v = String(value || '').toLowerCase();
  if (v === 'widely' || v === 'yes') return 'recyclable';
  if (v === 'sometimes' || v === 'limited' || v === 'special') return 'special';
  return 'not_recyclable';
}

/**
 * Filters a list of plastic types by category while preserving ascending resin code order (1..7).
 */
export function filterPlasticTypes(types = [], filterId = 'all') {
  if (!Array.isArray(types)) return [];
  const sorted = [...types].sort((a, b) => Number(a.code) - Number(b.code));
  if (!filterId || filterId === 'all') return sorted;
  return sorted.filter((item) => getPlasticCategory(item.status || item.recyclable) === filterId);
}

/**
 * Returns the DOM section anchor ID for a resin code (1..7).
 */
export function getPlasticAnchorId(code) {
  return `resin-${Number(code)}`;
}

