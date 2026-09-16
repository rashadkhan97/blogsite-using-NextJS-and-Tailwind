// ─────────────────────────────────────────────────────────────
// app/dashboard/blogs/page.jsx — My Blogs (user) / All Blogs (admin)
// (requirements.md §17-19)
//
// Normal users only ever see their own posts here (authorId filter),
// so anyone in this table is implicitly editable/deletable by them.
// Admins get every blog with no authorId filter, and can act on any row.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs, deleteBlog } from "@/services/blog.service";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DashboardBlogsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadBlogs = () => {
    if (!user) return;

    setLoading(true);
    setError("");

    getBlogs(isAdmin ? {} : { authorId: user.id })
      .then((res) => setBlogs(res.data.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Cannot reach the server. Is the backend running?"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadBlogs, [user, isAdmin]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(pendingDelete.id);
      setPendingDelete(null);
      setSuccessMessage("Blog deleted successfully");
      loadBlogs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "All Blogs" : "My Blogs"}
        </h1>
        <Link
          href="/dashboard/blogs/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Blog
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Loading blogs...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  {isAdmin
                    ? "No blogs found."
                    : "You haven't created any blogs yet."}
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {blog.blogTitle}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{blog.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {blog.author
                      ? `${blog.author.firstName} ${blog.author.lastName}`
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/blogs/${blog.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setPendingDelete(blog)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete blog"
        message={`Are you sure you want to delete "${pendingDelete?.blogTitle}"?`}
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
