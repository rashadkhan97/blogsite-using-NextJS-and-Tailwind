// ─────────────────────────────────────────────────────────────
// utils/photo.js — Shared rules for profile photo uploads
//
// Fast-feedback only. The backend enforces the same two rules in
// backend/middlewares/uploadMiddleware.js — never trust a client-side
// size/type check alone (requirements.md §39).
// ─────────────────────────────────────────────────────────────
export const MAX_PHOTO_MB = 3;
export const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

// Must match ALLOWED_TYPES in backend/middlewares/uploadMiddleware.js
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ACCEPT_ATTR = ALLOWED_TYPES.join(",");

export function validatePhoto(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Image must be a JPG, PNG, GIF or WEBP file";
  }

  if (file.size > MAX_PHOTO_BYTES) {
    const actualMb = (file.size / 1024 / 1024).toFixed(1);
    return `Image must be ${MAX_PHOTO_MB} MB or smaller (this one is ${actualMb} MB)`;
  }

  return null;
}
