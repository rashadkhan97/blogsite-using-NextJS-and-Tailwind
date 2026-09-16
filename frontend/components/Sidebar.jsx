// ─────────────────────────────────────────────────────────────
// components/Sidebar.jsx — Dashboard nav, role-based (requirements.md §4)
//
// Desktop-only for now (hidden below md). A mobile drawer version
// is planned for the responsive polish pass, not this checkpoint.
// ─────────────────────────────────────────────────────────────
"use client";

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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const links = user?.role === "admin" ? ADMIN_LINKS : USER_LINKS;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "rounded bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                  : "rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              }
            >
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="mt-2 rounded px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
