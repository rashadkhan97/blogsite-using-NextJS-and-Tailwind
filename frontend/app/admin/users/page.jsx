// ─────────────────────────────────────────────────────────────
// app/admin/users/page.jsx — Admin: user list (requirements.md §27, §29)
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, updateUserStatus } from "@/services/user.service";
import Avatar from "@/components/Avatar";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    setError("");

    getAllUsers()
      .then((res) => setUsers(res.data.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Cannot reach the server. Is the backend running?"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const toggleStatus = async (user) => {
    setUpdatingId(user.id);
    setError("");

    try {
      const updated = (await updateUserStatus(user.id, !user.isActive)).data.data;
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Users</h1>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="flex items-center gap-2 font-medium text-gray-800 hover:underline"
                    >
                      <Avatar user={u} />
                      {u.firstName} {u.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.role === "admin"
                          ? "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                          : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.isActive
                          ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                          : "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u)}
                      disabled={updatingId === u.id}
                      className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {updatingId === u.id
                        ? "Updating..."
                        : u.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
