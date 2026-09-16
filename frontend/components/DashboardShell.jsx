// ─────────────────────────────────────────────────────────────
// components/DashboardShell.jsx — Sidebar + content wrapper
//
// Shared by dashboard/layout.jsx and admin/layout.jsx (identical
// shell for both) — owns the mobile drawer's open/closed state and
// renders the "☰ Menu" toggle that only appears below md, since the
// global fixed Navbar has no sidebar-specific state of its own.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
      <div className="flex items-center border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <span aria-hidden="true">☰</span> Menu
        </button>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
