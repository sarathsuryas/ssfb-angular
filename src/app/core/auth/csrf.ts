export const CSRF_COOKIE = 'csrf_token';
export const CSRF_HEADER = 'X-CSRF-Token';

/** The backend sets this cookie without httpOnly so it can be echoed as a header. */
export function readCsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${CSRF_COOKIE}=`;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}
