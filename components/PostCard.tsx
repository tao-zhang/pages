import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.frontmatter.date);

  return (
    <article className="border-b border-gray-200 py-6 last:border-0">
      <h2 className="text-xl font-semibold leading-snug">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.frontmatter.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        <time dateTime={post.frontmatter.date}>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>
      <p className="mt-2 text-gray-700">{post.frontmatter.description}</p>
      {post.frontmatter.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
