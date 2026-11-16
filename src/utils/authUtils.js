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

