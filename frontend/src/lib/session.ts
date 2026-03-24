const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function setSessionTokens(params: {
  accessToken: string;
  refreshToken: string;
}) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearSessionTokens() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}