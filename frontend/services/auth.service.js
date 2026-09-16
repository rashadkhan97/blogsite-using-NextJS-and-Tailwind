import api from "@/utils/api";

export function register({ firstName, lastName, email, password }) {
  return api.post("/auth/register", { firstName, lastName, email, password });
}

export function login({ email, password }) {
  return api.post("/auth/login", { email, password });
}

export function forgotPassword(email) {
  return api.post("/auth/forgot-password", { email });
}

export function resetPassword(token, password) {
  return api.patch(`/auth/reset-password/${token}`, { password });
}
