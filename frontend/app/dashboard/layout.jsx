// ─────────────────────────────────────────────────────────────
// app/dashboard/layout.jsx — Dashboard shell (requirements.md §2, §13)
// ─────────────────────────────────────────────────────────────
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({ children }) {
  const { passed } = useAuthGuard();

  if (!passed) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
