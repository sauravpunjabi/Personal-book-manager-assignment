import type { CookieOptions, Response } from 'express';

const TOKEN_COOKIE = 'token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/** SameSite=None in production, because Vercel and Railway are different domains */
function cookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(TOKEN_COOKIE, token, { ...cookieOptions(), maxAge: SEVEN_DAYS_MS });
}

// clearCookie only matches if the options line up with the ones used to set it.
export function clearAuthCookie(res: Response): void {
  res.clearCookie(TOKEN_COOKIE, cookieOptions());
}
