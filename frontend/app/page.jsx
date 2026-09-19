// ─────────────────────────────────────────────────────────────
// app/page.jsx — Public homepage: browse/search/filter (requirements.md §5-8)
//
// Debounces the title search so typing doesn't fire a request per
// keystroke; category changes re-fetch immediately since they're
// discrete select changes, not a stream of keystrokes.
// ─────────────────────────────────────────────────────────────
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBlogs } from "@/services/blog.service";
import BlogCard from "@/components/BlogCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

function HomeContent() {
  const urlTitle = useSearchParams().get("title") || "";

  const [title, setTitle] = useState(urlTitle);
  const [lastUrlTitle, setLastUrlTitle] = useState(urlTitle);
  const [category, setCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // A search submitted from the navbar changes the URL — adopt it here.
  if (urlTitle !== lastUrlTitle) {
    setLastUrlTitle(urlTitle);
    setTitle(urlTitle);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let cancelled = false;
      setLoading(true);
      setError("");

      getBlogs({ title, category })
        .then((res) => {
          if (!cancelled) setBlogs(res.data.data);
        })
        .catch((err) => {
          if (!cancelled) {
            setError(
              err.response?.data?.message ||
                "Cannot reach the server. Is the backend running?"
            );
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [title, category]);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">BlogSpace</h1>
        <p className="mb-6 text-gray-600">
          Browse posts on testing, automation, programming, DevOps and AI.
        </p>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={title} onChange={setTitle} />
          <CategoryFilter value={category} onChange={setCategory} />
        </div>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// useSearchParams() must sit under a Suspense boundary so Next.js can
// still prerender the rest of the page.
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-56px)] bg-gray-50 p-6">
          <p className="mx-auto max-w-6xl text-gray-500">Loading blogs...</p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
