import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  author?: string;
  image?: string;
  draft?: boolean;
};

export type Post = {
  slug: string;
  content: string;
  frontmatter: PostFrontmatter;
};

function readPostFile(filename: string): Post {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const slug = (data.slug as string) || filename.replace(/\.mdx?$/, "");

  const frontmatter: PostFrontmatter = {
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags || [],
    author: data.author,
    image: data.image,
    draft: Boolean(data.draft),
  };

  return { slug, content, frontmatter };
}

/** All posts, newest first. Drafts are excluded outside of development. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map(readPostFile);

  const visible =
    process.env.NODE_ENV === "development"
      ? posts
      : posts.filter((p) => !p.frontmatter.draft);

  return visible.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((p) => p.frontmatter.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
