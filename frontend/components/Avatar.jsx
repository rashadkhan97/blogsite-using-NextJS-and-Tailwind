// ─────────────────────────────────────────────────────────────
// components/Avatar.jsx — Profile photo with initials fallback
//
// user.avatar is a path like "/uploads/abc.jpg" served by the BACKEND,
// not by Next.js — so it needs the SERVER_URL prefix. If the file is
// missing the request 404s, and onError falls back to initials instead
// of leaving a broken-image icon.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { SERVER_URL } from "@/utils/api";

export default function Avatar({ user, size = "sm" }) {
  const [failed, setFailed] = useState(false);

  const box = size === "lg" ? "h-20 w-20 text-xl" : "h-8 w-8 text-xs";

  if (user?.avatar && !failed) {
    return (
      <img
        src={`${SERVER_URL}${user.avatar}`}
        alt=""
        onError={() => setFailed(true)}
        className={`${box} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${box} flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600`}
    >
      {user?.firstName?.[0]}
      {user?.lastName?.[0]}
    </span>
  );
}
