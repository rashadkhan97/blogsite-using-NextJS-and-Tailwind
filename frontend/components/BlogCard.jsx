// ─────────────────────────────────────────────────────────────
// components/BlogCard.jsx — Blog preview card (requirements.md §5)
// ─────────────────────────────────────────────────────────────
import Link from "next/link";
import Avatar from "@/components/Avatar";

function truncate(text, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export default function BlogCard({ blog, variant = "default" }) {
  const author = blog.author;

  // Guests get the editorial card: label, title, excerpt, then an author
  // footer with a "Read article" link. Everyone else keeps the default.
  if (variant === "guest") {
    return (
      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          {blog.category}
        </p>
        <h2 className="mt-3 text-xl font-bold text-gray-900">
          {blog.blogTitle}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
          {truncate(blog.blog)}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <Avatar user={author} />
            <div className="text-xs leading-tight">
              <p className="font-semibold text-gray-800">
                {author ? `${author.firstName} ${author.lastName}` : "Unknown"}
              </p>
              <p className="text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <Link
            href={`/blogs/${blog.id}`}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Read
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg bg-white p-5 shadow">
      <span className="mb-2 inline-block w-fit rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
        {blog.category}
      </span>

      <h2 className="mb-2 text-lg font-bold text-gray-800">
        {blog.blogTitle}
      </h2>

      <p className="mb-4 flex-1 text-sm text-gray-600">
        {truncate(blog.blog)}
      </p>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Avatar user={author} />
        <span>
          {author ? `${author.firstName} ${author.lastName}` : "Unknown"}
        </span>
        <span>·</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="mt-auto inline-block rounded bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
      >
        Read More
      </Link>
    </div>
  );
}
