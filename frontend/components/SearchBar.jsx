// ─────────────────────────────────────────────────────────────
// components/SearchBar.jsx — Blog title search (requirements.md §6)
//
// Presentational: the parent owns the query string and debounce
// timing decisions, this just reports keystrokes upward.
// ─────────────────────────────────────────────────────────────
"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search blogs..."
      className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 sm:w-64"
    />
  );
}
