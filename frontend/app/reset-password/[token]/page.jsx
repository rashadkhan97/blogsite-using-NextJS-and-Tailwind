// ─────────────────────────────────────────────────────────────
// app/reset-password/[token]/page.jsx — requirements.md §26
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/auth.service";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.password || !form.confirmPassword) {
      setError("Both fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Cannot reach the server. Is the backend running?"
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Reset Password
        </h1>

        {success ? (
          <p className="rounded bg-green-50 p-3 text-sm text-green-700">
            Password successfully changed. Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
            />

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
