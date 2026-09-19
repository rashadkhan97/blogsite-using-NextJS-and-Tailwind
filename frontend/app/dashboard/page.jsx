// ─────────────────────────────────────────────────────────────
// app/dashboard/page.jsx — Dashboard home (requirements.md §15)
//
// One page, two layouts: a normal user sees their own blog count and
// recent posts; an admin sees platform-wide totals (blogs, users) and the
// latest posts across every author, each with its author and a preview.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";
import { getAllUsers } from "@/services/user.service";
import Avatar from "@/components/Avatar";

const RECENT_COUNT = 3;

function StatCard({ label, value, href, linkText }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
      <Link
        href={href}
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        {linkText} →
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [blogs, setBlogs] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const requests = [getBlogs(isAdmin ? {} : { authorId: user.id })];
    if (isAdmin) requests.push(getAllUsers());

    Promise.all(requests)
      .then(([blogsRes, usersRes]) => {
        setBlogs(blogsRes.data.data);
        if (usersRes) setTotalUsers(usersRes.data.data.length);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Cannot reach the server. Is the backend running?"
        );
      })
      .finally(() => setLoading(false));
  }, [user, isAdmin]);

  const recentBlogs = blogs.slice(0, RECENT_COUNT);
  const count = (n) => (loading ? "…" : n);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            {isAdmin ? "Admin dashboard" : "User dashboard"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName}
          </h1>
        </div>
        <Link
          href="/dashboard/blogs/create"
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Create a blog
        </Link>
      </div>

      {error && (
        <p className="mb-6 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div
        className={
          isAdmin
            ? "mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
            : "mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2"
        }
      >
        <StatCard
          label={isAdmin ? "Total blogs" : "Your blogs"}
          value={count(blogs.length)}
          href="/dashboard/blogs"
          linkText="View all blogs"
        />

        {isAdmin && (
          <StatCard
            label="Total users"
            value={count(totalUsers)}
            href="/admin/users"
            linkText="Manage users"
          />
        )}

        <div
          className={`rounded-2xl p-6 text-white shadow-sm ${
            isAdmin ? "sm:col-span-2" : ""
          }`}
          style={{ backgroundImage: "linear-gradient(135deg, #2563eb, #6366f1)" }}
        >
          <p className="text-sm text-blue-100">Profile information</p>
          <p className="mt-2 break-all text-lg font-semibold">{user?.email}</p>
          <p className="mt-1 text-sm capitalize text-blue-100">
            Role: {user?.role}
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-block text-sm font-medium text-white hover:underline"
          >
            Edit profile →
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            {isAdmin ? "Latest activity" : "Your writing"}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Recent blogs</h2>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/blogs"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            See all
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading blogs...</p>
      ) : recentBlogs.length === 0 ? (
        <p className="text-sm text-gray-500">
          {isAdmin
            ? "No blogs found."
            : "You haven't created any blogs yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                {blog.category}
              </p>
              <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-900">
                {blog.blogTitle}
              </h3>
              <div className="flex-1">
                <p className="mt-2 line-clamp-1 text-sm text-gray-600">
                  {blog.blog}
                </p>
                {isAdmin && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Avatar user={blog.author} />
                    <span>
                      {blog.author
                        ? `${blog.author.firstName} ${blog.author.lastName}`
                        : "Unknown"}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-4 text-sm font-medium">
                <Link
                  href={
                    isAdmin
                      ? `/blogs/${blog.id}?from=dashboard`
                      : `/blogs/${blog.id}`
                  }
                  className="text-blue-600 hover:underline"
                >
                  Read
                </Link>
                <Link
                  href={`/dashboard/blogs/${blog.id}/edit`}
                  className="text-gray-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
