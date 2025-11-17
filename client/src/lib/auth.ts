// client/src/lib/auth.ts
const TOKEN_KEY = "tm:jwt";

export const auth = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(TOKEN_KEY);
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
