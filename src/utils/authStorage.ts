import type { AuthSession } from "@/types/auth";

const AUTH_STORAGE_KEY = "product-dashboard:auth";
const AUTH_COOKIE_KEY = "product_dashboard_auth";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getCookie(name: string) {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : null;
}

function setCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export const authStorage = {
  get(): AuthSession | null {
    const rawSession = getCookie(AUTH_COOKIE_KEY) ?? window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as AuthSession;

      setCookie(AUTH_COOKIE_KEY, rawSession);
      window.localStorage.removeItem(AUTH_STORAGE_KEY);

      return session;
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      deleteCookie(AUTH_COOKIE_KEY);
      return null;
    }
  },

  set(session: AuthSession | null) {
    if (!session) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      deleteCookie(AUTH_COOKIE_KEY);
      return;
    }

    setCookie(AUTH_COOKIE_KEY, JSON.stringify(session));
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
