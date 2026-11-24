/**
 * Returns a safe in-app path to go back to after login.
 * Only internal paths are allowed and the auth screen itself is never a return target.
 */
export function getSafeReturnPath(from, fallback = '/home') {
  if (typeof from !== 'string') return fallback;
  if (!from.startsWith('/') || from.startsWith('//')) return fallback;
  if (from === '/auth' || from === '/') return fallback;
  return from;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

/** Normalizes a phone number (+91 / spaces stripped to 10 digits) or email (lowercased). */
export function normalizeIdentifier(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return '';
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
}

/** Validates a login/reset identifier as either a 10-digit phone number or an email address. */
export function validateIdentifier(raw) {
  const normalized = normalizeIdentifier(raw);
  if (!normalized) {
    return { valid: false, kind: null, normalized: '', error: 'auth_identifier_required' };
  }
  if (EMAIL_REGEX.test(normalized)) {
    return { valid: true, kind: 'email', normalized, error: null };
  }
  if (PHONE_REGEX.test(normalized)) {
    return { valid: true, kind: 'phone', normalized, error: null };
  }
  return { valid: false, kind: null, normalized, error: 'auth_identifier_invalid' };
}

/** Validates a password (minimum 6 characters). */
export function validatePassword(password) {
  const value = String(password || '');
  if (value.length < 6) {
    return { valid: false, error: 'auth_password_min' };
  }
  return { valid: true, error: null };
}

