// ─────────────────────────────────────────────────────────────
// components/BlogCard.jsx — Blog preview card (requirements.md §5)
// ─────────────────────────────────────────────────────────────
import Link from "next/link";

function truncate(text, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export default function BlogCard({ blog }) {
  const author = blog.author;

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
        {author?.avatar ? (
          <img
            src={author.avatar}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600">
            {author?.firstName?.[0]}
            {author?.lastName?.[0]}
          </span>
        )}
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
