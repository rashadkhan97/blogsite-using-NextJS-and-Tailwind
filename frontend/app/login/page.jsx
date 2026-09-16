// ─────────────────────────────────────────────────────────────
// app/login/page.jsx — Login form (requirements.md §11)
//
// On success: store the JWT + user in localStorage (lib/api.js reads
// the token back for every later request) and redirect to /dashboard.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login as loginRequest } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginRequest(form);
      const { token, user } = res.data.data;

      login(token, user);

      router.push("/dashboard");
    } catch (err) {
      // Unlike fetch, axios throws on 4xx/5xx — a wrong password or a
      // deactivated account lands here, not in the success path above.
      setError(
        err.response?.data?.message ||
          "Login failed. Is the backend running?"
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Login</h1>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
        />

        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
