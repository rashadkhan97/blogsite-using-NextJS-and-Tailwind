// ─────────────────────────────────────────────────────────────
// app/dashboard/page.jsx — Dashboard home (requirements.md §15)
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getBlogs(isAdmin ? {} : { authorId: user.id })
      .then((res) => setBlogs(res.data.data))
      .finally(() => setLoading(false));
  }, [user, isAdmin]);

  const recentBlogs = blogs.slice(0, 5);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Welcome, {user?.firstName}
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
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

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {isAdmin ? "Total Blogs (All Users)" : "Total Blogs"}
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {loading ? "..." : blogs.length}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Recent Blogs
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading blogs...</p>
        ) : recentBlogs.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven&apos;t created any blogs yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentBlogs.map((blog) => (
              <li key={blog.id} className="flex items-center justify-between py-3">
                <div>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="font-medium text-gray-800 hover:underline"
                  >
                    {blog.blogTitle}
                  </Link>
                  <p className="text-xs text-gray-500">{blog.category}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
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
