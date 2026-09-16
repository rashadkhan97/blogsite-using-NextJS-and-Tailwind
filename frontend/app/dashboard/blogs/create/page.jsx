// ─────────────────────────────────────────────────────────────
// app/dashboard/blogs/create/page.jsx — Create Blog (requirements.md §16)
//
// No userId is ever sent — the backend derives the author from the
// JWT (req.user.id), matching the restriction in requirements.md §16/§42.
// ─────────────────────────────────────────────────────────────
"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import { createBlog } from "@/services/blog.service";

export default function CreateBlogPage() {
  const router = useRouter();

  const handleSubmit = async (form) => {
    await createBlog(form);
    router.push("/dashboard/blogs");
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Blog</h1>
      <div className="max-w-2xl">
        <BlogForm
          onSubmit={handleSubmit}
          submitLabel="Publish Blog"
          submittingLabel="Publishing..."
        />
      </div>
    </div>
  );
}
