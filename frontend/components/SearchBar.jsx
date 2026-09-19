// ─────────────────────────────────────────────────────────────
// components/SearchBar.jsx — Blog title search (requirements.md §3, §6)
//
// Presentational: the parent owns the query string and debounce
// timing decisions, this just reports keystrokes upward. `className`
// sets the width — the homepage keeps the compact default, the navbar
// passes a wider one.
// ─────────────────────────────────────────────────────────────
"use client";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by blog title...",
  className = "sm:w-64",
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 4 4" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search blogs"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}
