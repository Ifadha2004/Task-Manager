// // src/api/http.ts
// import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

// export const USER_ID_KEY = "tm:userId";

// export const http = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
//   headers: { "Content-Type": "application/json" },
// });

// // attach X-USER-ID on every request
// http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const uid = localStorage.getItem(USER_ID_KEY) ?? "1"; // default to Alice for dev
//   const headers = (config.headers ??= new AxiosHeaders());
//   (headers as AxiosHeaders).set("X-USER-ID", uid);
//   return config;
// });

// src/api/http.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const USER_ID_KEY = "tm:userId";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const uid = localStorage.getItem(USER_ID_KEY) ?? "1";
  const headers = (config.headers ??= new AxiosHeaders());
  (headers as AxiosHeaders).set("X-USER-ID", uid);
  return config;
});
