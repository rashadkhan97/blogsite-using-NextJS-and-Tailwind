// ─────────────────────────────────────────────────────────────
// app/dashboard/page.jsx — Dashboard home (requirements.md §15)
//
// Total Blogs / Recent Blogs are deliberately left out until the
// blog API exists — showing placeholder numbers here would be the
// fake data the spec explicitly bans (§1, §42).
// ─────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Welcome, {user?.firstName}
      </h1>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Profile Information
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-gray-500">Name</span>
            <span className="font-medium text-gray-800">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div>
            <span className="block text-gray-500">Email</span>
            <span className="font-medium text-gray-800">{user?.email}</span>
          </div>
          <div>
            <span className="block text-gray-500">Role</span>
            <span className="font-medium capitalize text-gray-800">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/blogs/create"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Create Blog
      </Link>
    </div>
  );
}
