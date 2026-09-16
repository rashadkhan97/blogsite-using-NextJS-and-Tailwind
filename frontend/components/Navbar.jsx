// ─────────────────────────────────────────────────────────────
// components/Navbar.jsx — Fixed top bar, guest and logged-in states
//
// Reads the logged-in user from AuthContext, so it updates the moment
// login()/logout() run — no need to wait for a route change.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/Avatar";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.replace("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <Link href="/" className="font-bold text-gray-800">
        BlogSpace
      </Link>

      {user ? (
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full outline-none ring-blue-500 focus-visible:ring-2"
          >
            <Avatar user={user} />
            <span className="hidden text-sm font-medium text-gray-700 sm:inline">
              {user.firstName} {user.lastName}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/profile");
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/change-password");
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </nav>
      )}
    </header>
  );
}
