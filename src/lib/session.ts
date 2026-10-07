/**
 * Sessão: tokens ficam no localStorage (acesso pelo JS via axios) e um
 * cookie simples é espelhado para o middleware proteger as rotas.
 * A autorização real (roles) é validada pelo backend via JWT.
 */
const ACCESS_TOKEN_KEY = "sigepa_access_token";
const REFRESH_TOKEN_KEY = "sigepa_refresh_token";
const SESSION_COOKIE = "sigepa_session";
const ROLE_COOKIE = "sigepa_role";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  setCookie(SESSION_COOKIE, "1", 7);
}

export function saveRoleCookie(role: string) {
  setCookie(ROLE_COOKIE, role, 7);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  setCookie(SESSION_COOKIE, "", 0);
  setCookie(ROLE_COOKIE, "", 0);
}

export function hasSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_COOKIE}=`));
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  if (days <= 0) {
    document.cookie = `${name}=; Path=/; Max-Age=0`;
    return;
  }
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; Path=/; Expires=${expires}; SameSite=Lax`;
}
