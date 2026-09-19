// ─────────────────────────────────────────────────────────────
// components/Sidebar.jsx — Dashboard nav, role-based (requirements.md §4, §34)
//
// Desktop: static sidebar, always visible. Mobile: drawer, controlled
// by the `open`/`onClose` props from DashboardShell — closes itself
// automatically on navigation.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const USER_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/blogs", label: "My Blogs" },
  { href: "/dashboard/blogs/create", label: "Create Blog" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/change-password", label: "Change Password" },
];

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/blogs", label: "All Blogs" },
  { href: "/dashboard/blogs/create", label: "Create Blog" },
  { href: "/admin/users", label: "Users" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/change-password", label: "Change Password" },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const links = user?.role === "admin" ? ADMIN_LINKS : USER_LINKS;

  useEffect(() => {
    onClose();
    // Only re-run when the route changes, not when onClose's identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const navLinks = (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm"
                : "rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            }
          >
            {link.label}
          </Link>
        );
      })}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white md:block">
        {navLinks}
      </aside>

      {open && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 overflow-y-auto bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <span className="font-bold text-gray-800">Menu</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="text-xl leading-none text-gray-500"
              >
                &times;
              </button>
            </div>
            {navLinks}
          </aside>
        </div>
      )}
    </>
  );
}
