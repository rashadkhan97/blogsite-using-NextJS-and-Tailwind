import api from "@/utils/api";

export function register({ firstName, lastName, email, password }) {
  return api.post("/auth/register", { firstName, lastName, email, password });
}

export function login({ email, password }) {
  return api.post("/auth/login", { email, password });
}
