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
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";
import BlogCard from "@/components/BlogCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { FILTER_CATEGORIES } from "@/utils/categories";

function HomeFallback() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50 p-6">
      <p className="mx-auto max-w-6xl text-gray-500">Loading blogs...</p>
    </main>
  );
}

function HomeContent() {
  const { user, ready } = useAuth();
  const isGuest = !user;
  const searchParams = useSearchParams();
  const urlTitle = searchParams.get("title") || "";
  // ?category= is matched ignoring case; an unknown value is ignored.
  const urlCategory =
    FILTER_CATEGORIES.find(
      (c) => c.toLowerCase() === (searchParams.get("category") || "").toLowerCase()
    ) || "";

  const [title, setTitle] = useState(urlTitle);
  // Guests type into `draft` and apply it with the Search button / Enter.
  const [draft, setDraft] = useState(urlTitle);
  const [lastUrlTitle, setLastUrlTitle] = useState(urlTitle);
  const [category, setCategory] = useState(urlCategory || "All");
  const [lastUrlCategory, setLastUrlCategory] = useState(urlCategory);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // A search submitted from the navbar (or a typed URL) changes the query
  // string — adopt it here.
  if (urlTitle !== lastUrlTitle) {
    setLastUrlTitle(urlTitle);
    setTitle(urlTitle);
    setDraft(urlTitle);
  }
  if (urlCategory !== lastUrlCategory) {
    setLastUrlCategory(urlCategory);
    if (urlCategory) setCategory(urlCategory);
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

  const handleGuestSearch = (e) => {
    e.preventDefault();
    setTitle(draft.trim());
  };

  // Wait for the stored login to load, so a logged-in user never sees the
  // guest layout (or the other way round) for a split second.
  if (!ready) return <HomeFallback />;

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {isGuest ? (
          <form
            onSubmit={handleGuestSearch}
            role="search"
            className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search blogs..."
                aria-label="Search blogs"
                className="w-full flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
              />
              <CategoryFilter
                value={category}
                onChange={setCategory}
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 sm:w-40"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Search
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Search blogs by title, filter by category, or use both together.
            </p>
          </form>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">BlogSpace</h1>
            <p className="mb-6 text-gray-600">
              Browse posts on testing, automation, programming, DevOps and AI.
            </p>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <SearchBar value={title} onChange={setTitle} />
              <CategoryFilter value={category} onChange={setCategory} />
            </div>
          </>
        )}

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
              <BlogCard
                key={blog.id}
                blog={blog}
                variant={isGuest ? "guest" : "default"}
              />
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
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
