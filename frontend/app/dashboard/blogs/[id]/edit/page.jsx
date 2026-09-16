// ─────────────────────────────────────────────────────────────
// app/dashboard/blogs/[id]/edit/page.jsx — Update Blog (requirements.md §18)
//
// Ownership is enforced by the backend (403 "You are not authorized to
// update this blog"), which BlogForm surfaces as its inline error —
// this page doesn't need its own ownership check to be secure.
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import { getBlogById, updateBlog } from "@/services/blog.service";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogById(id)
      .then((res) => setBlog(res.data.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Blog not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form) => {
    await updateBlog(id, form);
    router.push("/dashboard/blogs");
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Blog</h1>
      <div className="max-w-2xl">
        {loading ? (
          <p className="text-gray-500">Loading blog...</p>
        ) : error ? (
          <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
        ) : (
          <BlogForm
            initialValues={blog}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            submittingLabel="Saving..."
          />
        )}
      </div>
    </div>
  );
}
