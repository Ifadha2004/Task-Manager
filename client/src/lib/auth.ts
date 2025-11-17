// client/src/lib/auth.ts
const TOKEN_KEY = "tm:jwt";

type JwtPayload = {
  exp?: number; // seconds since epoch
  [key: string]: unknown;
};

function isExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return false;

    // Decode JWT payload (base64url → JSON)
    const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as JwtPayload;

    if (!payload.exp) return false;
    const expiresAtMs = payload.exp * 1000;
    return Date.now() >= expiresAtMs;
  } catch {
    // If decoding fails, treat as invalid/expired
    return true;
  }
}

export const auth = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // Auto-logout if token is expired
    if (isExpired(token)) {
      window.sessionStorage.removeItem(TOKEN_KEY);
      return null;
    }

    return token;
  },

  set(token: string) {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(TOKEN_KEY, token);
  },

  clear() {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(TOKEN_KEY);
  },
};
