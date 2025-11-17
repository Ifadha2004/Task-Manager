// import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

// export const USER_ID_KEY = "tm:userId";

// export const http = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
//   headers: { "Content-Type": "application/json" },
// });

// http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const uid = localStorage.getItem(USER_ID_KEY) ?? "1";
//   const headers = (config.headers ??= new AxiosHeaders());
//   (headers as AxiosHeaders).set("X-USER-ID", uid);
//   return config;
// });

// client/src/api/http.ts
import axios, {
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosError,
} from "axios";
import { auth } from "../lib/auth";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT on every request
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = auth.get();

  const headers = (config.headers ??= {} as AxiosRequestHeaders);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }

  return config;
});

// ✅ Global 401 handler – auto-logout & redirect
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token invalid or expired → clear + send to login
      auth.clear();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
