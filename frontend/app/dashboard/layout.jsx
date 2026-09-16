// ─────────────────────────────────────────────────────────────
// app/dashboard/layout.jsx — Dashboard shell (requirements.md §2, §13)
//
// Checks localStorage directly rather than AuthContext's `isAuthenticated`:
// login() writes the token to localStorage synchronously before the
// redirect to here, so this is the fastest, race-free source of truth —
// no need to wait for AuthContext's own hydration effect to catch up.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
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
