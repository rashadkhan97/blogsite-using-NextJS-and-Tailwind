// ─────────────────────────────────────────────────────────────
// app/dashboard/layout.jsx — Dashboard shell (requirements.md §2, §13)
//
// Client-side guard: waits for AuthContext to finish reading
// localStorage (`ready`) before deciding whether to redirect, so a
// logged-in user isn't bounced to /login during the hydration tick.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
