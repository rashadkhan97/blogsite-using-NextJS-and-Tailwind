// ─────────────────────────────────────────────────────────────
// components/BlogForm.jsx — Shared create/edit blog form
// (requirements.md §16, §18)
//
// Presentational: the parent owns submission (create vs update call)
// and loading state; this only owns the field values.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { CATEGORIES } from "@/utils/categories";

export default function BlogForm({ initialValues, onSubmit, submitLabel, submittingLabel }) {
  const [form, setForm] = useState({
    blogTitle: initialValues?.blogTitle || "",
    blog: initialValues?.blog || "",
    category: initialValues?.category || CATEGORIES[0],
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.blogTitle.trim() || !form.blog.trim() || !form.category) {
      return "Title, content and category are all required";
    }
    if (form.blogTitle.trim().length < 3) {
      return "Title must be at least 3 characters";
    }
    if (form.blog.trim().length < 20) {
      return "Content must be at least 20 characters";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Is the backend running?"
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <label className="mb-1 block text-sm font-medium text-gray-700">
        Blog Title <span className="text-red-500">*</span>
      </label>
      <input
        name="blogTitle"
        value={form.blogTitle}
        onChange={handleChange}
        required
        className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
      />

      <label className="mb-1 block text-sm font-medium text-gray-700">
        Category <span className="text-red-500">*</span>
      </label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-sm font-medium text-gray-700">
        Blog Content <span className="text-red-500">*</span>
      </label>
      <textarea
        name="blog"
        value={form.blog}
        onChange={handleChange}
        required
        rows={10}
        className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
      />

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
