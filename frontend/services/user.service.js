import api from "@/utils/api";

export function getProfile() {
  return api.get("/users/profile");
}

export function updateProfile({ firstName, lastName }) {
  return api.put("/users/profile/update", { firstName, lastName });
}

export function updateProfileImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return api.patch("/users/profile/image", formData);
}

export function changePassword(password) {
  return api.patch("/users/password", { password });
}
