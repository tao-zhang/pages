import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MdxContent } from "@/components/MdxContent";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      images: post.frontmatter.image ? [post.frontmatter.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${siteConfig.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Organization",
      name: post.frontmatter.author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.frontmatter.tags.join(", "),
    ...(post.frontmatter.image ? { image: post.frontmatter.image } : {}),
  };

  const date = new Date(post.frontmatter.date);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={jsonLd} />
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          {post.frontmatter.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          <time dateTime={post.frontmatter.date}>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.frontmatter.author ? ` · ${post.frontmatter.author}` : ""}
        </p>
      </header>
      <div className="prose prose-neutral mt-8 max-w-none">
        <MdxContent source={post.content} />
      </div>
    </article>
  );
}
