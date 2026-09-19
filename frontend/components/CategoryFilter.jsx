// ─────────────────────────────────────────────────────────────
// components/CategoryFilter.jsx — Category dropdown (requirements.md §7)
// ─────────────────────────────────────────────────────────────
"use client";

import { FILTER_CATEGORIES } from "@/utils/categories";

export default function CategoryFilter({
  value,
  onChange,
  className = "rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500",
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      {FILTER_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
