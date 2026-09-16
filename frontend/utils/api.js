// ─────────────────────────────────────────────────────────────
// utils/api.js — One shared axios instance for the whole app
//
// baseURL is written once here instead of repeated in every
// service file, and the interceptor attaches the JWT automatically
// once login exists, so no page has to remember the header itself.
// ─────────────────────────────────────────────────────────────
import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
