import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="mt-3 max-w-xl text-gray-600">{siteConfig.description}</p>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Latest posts</h2>
          <Link href="/blog" className="text-sm text-gray-500 hover:text-black">
            View all →
          </Link>
        </div>
        <div className="mt-4">
          {latestPosts.length === 0 ? (
            <p className="text-gray-500">
              No posts published yet — add MDX files to{" "}
              <code>content/posts</code> to get started.
            </p>
          ) : (
            latestPosts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
}
