// client/src/api/httpAuth.ts
import axios from "axios";

export const httpAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL ?? "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});
