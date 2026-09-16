// ─────────────────────────────────────────────────────────────
// app/blogs/[id]/page.jsx — Blog details (requirements.md §9)
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBlogById } from "@/services/blog.service";
import Avatar from "@/components/Avatar";

export default function BlogDetailsPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError("");

    getBlogById(id)
      .then((res) => setBlog(res.data.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(
            err.response?.data?.message ||
              "Cannot reach the server. Is the backend running?"
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading blog...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Blog Not Found</h1>
        <p className="text-gray-600">
          This blog may have been removed or never existed.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to all blogs
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-50 p-4">
        <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
      </main>
    );
  }

  const author = blog.author;

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
        <span className="mb-3 inline-block w-fit rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {blog.category}
        </span>

        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          {blog.blogTitle}
        </h1>

        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Avatar user={author} />
          <span>
            {author ? `${author.firstName} ${author.lastName}` : "Unknown"}
          </span>
          <span>·</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="whitespace-pre-wrap text-gray-700">{blog.blog}</p>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to all blogs
        </Link>
      </div>
    </main>
  );
}
