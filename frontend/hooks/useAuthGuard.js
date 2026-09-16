// ─────────────────────────────────────────────────────────────
// hooks/useAuthGuard.js — Shared route-protection logic
// (requirements.md §13-14)
//
// Checks localStorage's token directly for the redirect decision
// (not AuthContext state) — see the memory note on why: context
// hydration lagged the navigation by a render cycle and bounced
// logged-in users back to /login. requireRole adds a second check
// once the context has caught up, for admin-only routes.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthGuard(requireRole) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setHasToken(true);
  }, [router]);

  useEffect(() => {
    if (hasToken && ready && requireRole && user && user.role !== requireRole) {
      router.replace("/dashboard");
    }
  }, [hasToken, ready, user, requireRole, router]);

  const passed = hasToken && (!requireRole || (ready && user?.role === requireRole));
  return { passed };
}
