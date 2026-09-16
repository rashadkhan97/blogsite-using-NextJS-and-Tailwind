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

// Uploaded files (avatars) are served from the backend's origin, not
// under /api — strip the /api suffix to get a plain origin to prefix them with.
export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

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

// A 401 on a PROTECTED endpoint means the token is missing/expired/invalid —
// force a logout so the user isn't left staring at a stale authenticated
// page (requirements.md §42: don't ignore backend 401/403 responses).
// /auth/* is excluded: login's own 401 ("Invalid email or password") must
// stay inline on the login form, not trigger a redirect away from it.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith("/auth/");

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
