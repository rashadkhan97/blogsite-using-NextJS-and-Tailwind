// ─────────────────────────────────────────────────────────────
// app/admin/users/[id]/page.jsx — Admin: view one user (requirements.md §28-29)
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUserById, updateUserStatus } from "@/services/user.service";
import Avatar from "@/components/Avatar";

export default function AdminUserDetailPage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getUserById(id)
      .then((res) => setUser(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "User not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStatus = async () => {
    setUpdating(true);
    setError("");

    try {
      const updated = (await updateUserStatus(id, !user.isActive)).data.data;
      setUser(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/users"
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to users
      </Link>

      {loading ? (
        <p className="text-gray-500">Loading user...</p>
      ) : error ? (
        <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
      ) : (
        <div className="max-w-xl rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center gap-4">
            <Avatar user={user} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h1>
              <span
                className={
                  user.role === "admin"
                    ? "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                    : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                }
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-gray-500">Email</span>
              <span className="font-medium text-gray-800">{user.email}</span>
            </div>
            <div>
              <span className="block text-gray-500">Status</span>
              <span
                className={
                  user.isActive
                    ? "font-medium text-green-700"
                    : "font-medium text-red-700"
                }
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <span className="block text-gray-500">Created</span>
              <span className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            onClick={toggleStatus}
            disabled={updating}
            className={
              user.isActive
                ? "rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                : "rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            }
          >
            {updating
              ? "Updating..."
              : user.isActive
                ? "Deactivate User"
                : "Activate User"}
          </button>
        </div>
      )}
    </div>
  );
}
