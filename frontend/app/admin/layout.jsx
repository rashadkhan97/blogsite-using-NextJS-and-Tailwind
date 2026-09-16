// ─────────────────────────────────────────────────────────────
// app/admin/layout.jsx — Admin-only shell (requirements.md §14)
//
// Non-admins are redirected to /dashboard rather than shown
// "Access Denied" text — the backend's adminMiddleware 403s the
// actual data requests regardless, so this is UX only, not the
// real security boundary (per §14: don't rely only on hiding the menu).
// ─────────────────────────────────────────────────────────────
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import DashboardShell from "@/components/DashboardShell";

export default function AdminLayout({ children }) {
  const { passed } = useAuthGuard("admin");

  if (!passed) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
